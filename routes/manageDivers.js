var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Util = require('util');
const Joi = require('joi');
const diversDebugger = require('debug')('app:divers');
const db = require('../db/dbDiver')

const getSchema = Joi.object().keys({
    id: Joi.string().min(24).max(24).required()
});
const diverSchema = Joi.object().keys({
    name: Joi.string().min(1).max(30).required(),
    seller: Joi.string().min(1).max(30).required(),
    activity: Joi.string().min(1).max(30).required(),
    daysDiving: Joi.array().items(Joi.string()).required(),
    price: Joi.number()
});

router.get('/:id', function(req, res) {
    //Validate input
    const result = Joi.validate(req.params, getSchema);
    diversDebugger('manageDivers.js -> get divers/:id \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    //return data
    db.getFromDB(req.params.id, function(result){
        diversDebugger('Divers result \n'+result);
        if(result == undefined){
            res.status(500).send('Error on DB');
            return;
        }
        res.send(result);
    });
    return;
    //res.send('Get with id' + req.params.id);
});

router.post('/addDiver', function(req, res) {
    diversDebugger(req.body.name, req.body.seller, req.body.activity);
    const result = Joi.validate(req.body, diverSchema);
    if(result.error){
        diversDebugger(result);
        res.status(400).send('Bad request. Name length should be greater or equals 3');
        return;
    }
    diversDebugger(req.body.name, req.body.seller, req.body.activity, req.body.daysDiving);

    db.addDiver(req.body.name, req.body.seller, req.body.activity, req.body.daysDiving, req.body.price, function(result){
        diversDebugger('Add diver');
        if(result === undefined){
            res.status(500).send();
            return;
        }
        res.send(result);
    });
    return;
});

router.put('/update/:id', function(req, res) {
    const result = Joi.validate(req.params, getSchema);
    diversDebugger('manageDivers.js -> put updateDiver/:id \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    db.updateDiver(req.params.id, req.body.name, req.body.seller, req.body.activity, function(result){
        diversDebugger('update diver \n'+result);
        if(result === undefined){
            res.status(500).send();
            return;
        }
        res.send(result);
    });
    return;
});

router.put('/update', function(req, res) {
    const result = Joi.validate(req.query, getSchema);
    diversDebugger('manageDivers.js -> put updateDiver \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    db.updateDiver(req.query.id, req.body.name, req.body.seller, req.body.activity, function(result){
        diversDebugger('update diver \n'+result);
        if(result === undefined){
            diversDebugger('Value was undefined');
            res.status(500).send();
            return;
        }
        res.send(result);
        return;
    });
});

router.delete('/delete/:id', function(req, res) {
    const result = Joi.validate(req.params, getSchema);
    diversDebugger('manageDivers.js -> put updateDiver/:id \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    db.deleteDiver(req.params.id, function(result){
        diversDebugger('delete diver \n'+result);
        if(result === undefined){
            res.status(500).send();
            return;
        }
        res.send(result);
    });
    return;
});


module.exports = router;
