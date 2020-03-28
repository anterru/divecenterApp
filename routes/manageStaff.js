var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Util = require('util');
const Joi = require('joi');
const staffDebugger = require('debug')('app:staff');
const db = require('../db/dbStaff');

const getSchema = Joi.object().keys({
    id: Joi.string().min(24).max(24).required()
});

const staffSchema = Joi.object().keys({
    name: Joi.string().min(1).max(30).required(),
    agency: Joi.array().items(Joi.string().valid(['SSI', 'PADI'])).required(),
    languages: Joi.array().items(Joi.string()).required(),
});

router.get('/:id', function(req, res) {
    //Validate input
    const result = Joi.validate(req.params, getSchema);
    staffDebugger('manageStaff.js -> get staff/:id \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    //return data
    db.getFromDB(req.params.id, function(result){
        staffDebugger('Staff result \n'+result);
        if(result == undefined) {
            res.status(500).send('Error on DB');
            return;
        }
        res.send(result);
    });
    //res.send('Get with id' + req.params.id);
});

router.post('/addStaff', function(req, res) {
    const result = Joi.validate(req.body, staffSchema);
    if(result.error){
        staffDebugger(result);
        res.status(400).send('Bad request. Name length should be greater or equals 3');
        return;
    }
    staffDebugger(req.body.name, req.body.agency, req.body.languages);

    db.addStaff(req.body.name, req.body.languages, req.body.agency,function(result){
        staffDebugger('Add diver');
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
    staffDebugger(req.params+ "   \n" + result);
    staffDebugger('manageStaff.js -> put updateStaff/:id \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    db.updateStaff(req.params.id, req.body.name, req.body.languages, req.body.agency, function(result){
        staffDebugger('update staff \n'+result);
        if(result === undefined){
            res.status(500).send();
            return;
        }
        res.send(result);
    });
    return;
});

router.delete('/delete/:id', function(req, res) {
    const result = Joi.validate(req.params, getSchema);
    staffDebugger('manageStaff.js -> put updateStaff/:id \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    db.deleteStaff(req.params.id, function(result){
        staffDebugger('delete staff \n'+result);
        if(result === undefined){
            res.status(500).send();
            return;
        }
        res.send(result);
    });
    return;
});
module.exports = router;
