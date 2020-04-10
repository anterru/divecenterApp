const config = require('config');
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Util = require('util');
const userDebugger = require('debug')('app:password');
const db = require('../db/dbHelper');
const _ = require('lodash');
const passwordComplexity = require('joi-password-complexity');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth').auth;

const userSchema = mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        lowercase: true,
        trim: true      //Remove white spaces from beginning and end
    },
    email: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
    
});

userSchema.methods.getAuthToken = function (){
    const token = jwt.sign({_id: this.id, isAdmin: this.isAdmin, email: this.email}, config.get('jwtPrivateKey'));   //Any object is ok + private key that can be any string
    return token;
};

const passwordComplexityOptions = {
    min: 10,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
  }

User = mongoose.model('user', userSchema);


router.get('/myProfile', auth, function(req, res){
    userDebugger("myProfile " + req.user._id + " " + req.user.email + " " + req.user.isAdmin)
    db.getItemSelectParams({"email": req.user.email}, User, "-password", function(result){
        if(result == undefined || result.length == 0){
            return res.status(500).send('Error on DB');
        }
        if(result[0]._id != req.user._id){
            return res.status(403).send("Forbidden")
        }
        return res.send(result);
    });
});

router.delete('/delete', auth, function(req, res){
    db.getItemSelectParams({"_id": req.user._id}, User, "-password", function(result){
        userDebugger(result)
        if(result == undefined || result.length == 0){
            return res.status(500).send('Could not find the user');
        }
        if(result[0]._id != req.user._id){
            return res.status(403).send("Forbidden")
        }
        db.deleteItem(req.user._id, User, function(result){
            userDebugger(result)
            if (parseInt(result.deletedCount) > 0){
                return res.send("deleted");
            }
            return res.status(500).send("Could not delete the user");
        });
        
    });
});

router.post('/register', function(req, res) {
    db.setupConnection();
    userDebugger(req.body);
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            userDebugger("Error "+ err);
            return;
        }
        if(user){
            userDebugger("User " + Util.inspect(user));
            res.status(400).send("Email already registered");
            return;
        } 

        var validPass = passwordComplexity(passwordComplexityOptions).validate(req.body.password);
        if(validPass.error){
            userDebugger(validPass);
            res.status(400).send("Password should be at least 10 characters long, include 1 upper letter, 1 lower letter and a symbol");
            return;
        }
        user = new User(_.pick(req.body, 'name', 'email', 'password', 'isAdmin'));
        bcrypt.genSalt(10, function(err, salt){
            if(err){
                res.status(400).send("Error generating salt " + err);
                return;
            }
            bcrypt.hash(user.password, salt, function(err, hashedPassword){
                if(err){
                    res.status(400).send("Error generating password " + err);
                    return;
                }
                user.password = hashedPassword;
                userDebugger("HashedPassword "+user.password);
                user.save(function(err){
                    if(err){
                        res.status(400).send("Error saving user " +err);
                    }
                    else{
                        res.status(200).send(_.pick(user, ['name', 'email']));
                    }
                });
            })
        });
    });
    return;
});


module.exports = router;

