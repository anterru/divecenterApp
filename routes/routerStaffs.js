var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Util = require('util');
const Joi = require('joi');
const staffDebugger = require('debug')('app:staff');
const db = require('../db/dbHelper');

const getSchema = Joi.object().keys({
    id: Joi.string().min(24).max(24).required()
});


const staffSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        lowercase: true,
        trim: true      //Remove white spaces from beginning and end
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
    title: {
        type: "array",
        items: {
            type: "object",
            properties: {
                agency: {
                    type: String,
                    required: true
                },
                level: {
                    type: String,
                    required: true,
                    enum: ["DMT", "DM", "Instructor"]
                }
            }
        }
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
                comment: {
                    type: String
                }
            }
        }
    },
    morning_food: {
        type: String
    },
    afternoon_food: {
        type: String
    }
});

Staff = mongoose.model('staff', staffSchema);

router.get('/:id', function(req, res) {
    //Validate input
    const result = Joi.validate(req.params, getSchema);
    staffDebugger('manageStaff.js -> get staff/:id \n');// + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    //return data
    db.getItem(req.params.id, Staff,next=function(result){
        //staffDebugger('Staff result \n'+result);
        if(result == undefined) {
            res.status(500).send('Error on DB');
            return;
        }
        res.send(result);
    });
    //res.send('Get with id' + req.params.id);
});

router.post('/addStaff', function(req, res) {
    db.addItem(req.body, Staff, function(result){
                    //staffDebugger('Add staff');
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
    //staffDebugger(req.params+ "   \n" + result);
    staffDebugger('manageStaff.js -> put updateItem/:id \n');// + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    db.updateItem(req.params.id, Staff, req.body, function(result){
        //staffDebugger('update staff \n'+result);
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
    staffDebugger('manageStaff.js -> put deleteStaff/:id \n');// + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    db.deleteItem(req.params.id, Staff, function(result){
        //staffDebugger('delete staff \n'+result);
        if(result === undefined){
            res.status(500).send();
            return;
        }
        res.send(result);
    });
    return;
});
module.exports = router;
