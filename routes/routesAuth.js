const config = require('config');
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const authDebugger = require('debug')('app:auth');
const db = require('../db/dbHelper')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function validate(user){
    const schema = {
        //name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(user, schema);
}

router.post('/login', function(req, res) {
    db.setupConnection();
    authDebugger(req.body);
    validate(req.body);

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            authDebugger("Error "+ err);
            return;
        }
        if(!user){
            authDebugger("User not found");
            res.status(400).send("Email or password incorrect");
            return;
        } 

        bcrypt.compare(req.body.password, user.password, function(err, valid){
            if(err){
                authDebugger(err);
                res.status(500).send("Internal server error");
                return;
            }
            if(valid){
                authDebugger("Logged in");
                //Instead of config, we could use process.env.jwtPrivateKey
                const token = user.getAuthToken();
                res.status(200).send(token);
                return;
            }
            res.status(400).send("Email or password incorrect");
            return;
        });
    });
});

module.exports = router;