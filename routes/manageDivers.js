var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Util = require('util');
const Joi = require('joi');
const diversDebugger = require('debug')('app:divers');
const db = require('../db/dbHelper')

const getSchema = Joi.object().keys({
    id: Joi.string().min(24).max(24).required()
});
/*const diverSchema = Joi.object().keys({
    name: Joi.string().min(1).max(30).required(),
    seller: Joi.string().min(1).max(30).required(),
    activity: Joi.string().min(1).max(30).required(),
    daysDiving: Joi.array().items(Joi.string()).required(),
    price: Joi.number()
});*/

const diverSchema = mongoose.Schema({
    name: { 
                type: String,
                required: true,
                minlength: 1,
                maxlength: 100,
                lowercase: true,
                trim: true      //Remove white spaces from beginning and end
          },
    country: { type: String,
                required: true,
                minlength: 1,
                maxlength: 100,
                lowercase: true,
                trim: true      //Remove white spaces from beginning and end
                },
    dateSignUp: { 
                type: Date,
                default: Date.now
            },
    dateOfBirth: {
                type: Date,
                required: true
    },
    equipment: {
        type: "array",
        items: {
            type: "object",
            properties: {
                fins: {
                    type: String,
                    required: true
                },
                ws: {
                    type: String,
                    required: true
                },
                bcd: {
                    type: String,
                    required: true
                },
                mask: {
                    type: String,
                    required: true
                },
                comment: {
                    type: String
                }
            }
        }
    },
    numOfDives:    {
        type: Number,
        required: true
    },
    languages:   {
        type: [String],
        required: true,
        minItems: 1,
        validate: {
            validator: function (v) {
                return v && v.length > 0;  //First check to check it is not null
            },
            message: 'At least one valid language should be specified'
        }
    },
    license: {
        level: {
            type: String,
            required: true
        },
        agency: {
            type: String,
            required: true
        },
        checker: {
            type: mongoose.Schema.Types.ObjectID,   //Also possible to refer to the Schema. Video 115
            ref: 'staff'
        }
    }
});
const Diver = mongoose.model('divers', diverSchema); //This is a class

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
    db.getItem(req.params.id, Diver, fieldToPopulate='license.checker', 
                            selectedPopulatedFields='name', itemFields='name', function(result){
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
    diversDebugger(req.body);
    db.addItem(req.body, Diver, function(result){
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
    db.deleteItem(req.params.id, Diver, function(result){
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
