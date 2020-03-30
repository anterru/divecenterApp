var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Util = require('util');
const Joi = require('joi');
const listDebugger = require('debug')('app:list');
const db = require('../db/dbHelper');
const dbList = require('../db/dbList');

const getSchema = Joi.object().keys({
    id: Joi.string().min(24).max(24).required()
});


const listSchema = mongoose.Schema({
    description:{
        place: {
            type: String,
            required: true,
            enum: ["big boat", "small boat", "special trip", "shop"]
        },
        comment: {
            type: String
        }
    },
    date: {
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        },
        time: {
            type: String,
            required: true,
            enum: ["morning", "afternoon", "night"]
        }
    },
    activities:   
    [{
        staff: [{
            name: {
                type: mongoose.Schema.Types.ObjectID,   //Also possible to refer to the Schema. Video 115
                ref: 'staff'
            },
            food: {
                type: String
            }  
        }],
        divers: [{
            name:  {
                type: mongoose.Schema.Types.ObjectID,   
                ref: 'divers'
            },
            activity:{
                type: String,
                required: true,
                enum: ["Confine", "OW", "AOW", "Resc", "DM", "Fundive", "Special"]
            },
            price: {
                type: Number,
                required: true
            },
            paid: {
                type: Number,
                required: true
            },
            food: {
                type: String,
                required: true
            },
            comment: {
                type: String
            },
            soldBy: [
                {
                    staff: {
                        type: mongoose.Schema.Types.ObjectID,   //Also possible to refer to the Schema. Video 115
                        ref: 'staff'
                    }
                }  
            ]
        }]
    }],
    briefing: {
        type: mongoose.Schema.Types.ObjectID,   //Also possible to refer to the Schema. Video 115
        ref: 'staff'
    },
    packing: [{
        name:{
            type: mongoose.Schema.Types.ObjectID,   //Also possible to refer to the Schema. Video 115
            ref: 'staff'
        }
    }]
});

List = mongoose.model('list', listSchema);


router.get('/populated', function(req, res) {
    //Validate input
    const result = Joi.validate(req.query, getSchema);
    listDebugger('manageLists.js -> getPopulated list/ \n' + Util.inspect( req.query ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    //return data
    dbList.getItemPopulated(req.query.id, List,next=function(result){
        listDebugger('Staff result \n'+result);
        if(result == undefined) {
            res.status(500).send('Error on DB');
            return;
        }
        res.send(result);
    });
    //res.send('Get with id' + req.params.id);
});

router.get('/:id', function(req, res) {
    //Validate input
    const result = Joi.validate(req.params, getSchema);
    listDebugger('manageLists.js -> get list/:id \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    //return data
    db.getItem(req.params.id, List,next=function(result){
        listDebugger('Staff result \n'+result);
        if(result == undefined) {
            res.status(500).send('Error on DB');
            return;
        }
        res.send(result);
    });
    //res.send('Get with id' + req.params.id);
});

router.post('/addList', function(req, res) {
    listDebugger('manageLists.js -> post list \n' + Util.inspect( req.body ));
    db.addItem(req.body, List, function(result){
        listDebugger('manageLists.js -> add list');
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
    listDebugger(req.params+ "   \n" + result);
    listDebugger('manageLists.js -> put list \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    db.updateItem(req.params.id, List, req.body, function(result){
        listDebugger('update staff \n'+result);
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
    listDebugger('manageLists.js -> delete list \n' + Util.inspect( req.params ) + "\nResult\n" + Util.inspect(result));

    //return in case of bad format
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    db.deleteItem(req.params.id, List, function(result){
        listDebugger('delete staff \n'+result);
        if(result === undefined){
            res.status(500).send();
            return;
        }
        res.send(result);
    });
    return;
});
module.exports = router;

