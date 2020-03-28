const mongoose = require('mongoose');
//const db = mongoose.connection;
const db = require('./dbHelper');
const dbDebugger = require('debug')('app:db');
const dbErr = require('debug')('app:err');
const staffModel= require('./dbStaff').Staff;


//Diver schema on DB
const diverSchema = mongoose.Schema({
    name:     { type: String,
                required: true,
                minlength: 1,
                maxlength: 100,
                lowercase: true,
                trim: true      //Remove white spaces from beginning and end
              },
    seller: {
        type: mongoose.Schema.Types.ObjectID,   //Also possible to refer to the Schema. Video 115
        ref: 'staff',
        required: true
    },
    /*seller:   { type: String,
                required: true,
                minlength: 1,
                maxlength: 100
              },*/
    activity: { type: String,
                required: true,
                enum: ['fundive', 'OW', 'AOW', 'Rescue', 'DSD']
              },
    price:    {
                 type: Number,
                 required: true,
                 get: v => Math.round(v),
                 set: v => Math.round(v),
                },
    daysDiving: {
                type: Array,
                validate: {
                    validator: function (v) {
                        return v && v.length > 0;  //First check to check it is not null
                    },
                    message: 'A registered diver should dive at least once'
                }
    },
    dateSold: { type: Date,
                default: Date.now
              }
});
const Diver = mongoose.model('divers', diverSchema); //This is a class

async function getFromDB (id, next) {
    db.setupConnection();
    const result = await Diver.find({_id: id})
        .populate('seller');
        //.select('name staffs');
    dbDebugger('Retrieved \n' +result)
    next(result);
};
module.exports.getFromDB = getFromDB;

async function addDiver(name, seller, activity, daysDiving, price, next){
    db.setupConnection();
    const newDiver = new Diver({    //It checks every param is correct before saving
        name: name,
        seller: seller,
        activity: activity,
        daysDiving: daysDiving,
        price: price
    });

    var result;
    try{
        result = await newDiver.save();     //Here is where the validation is performed
        dbDebugger('Added');
    }
    catch(ex){
        result = undefined
        for (field in ex.errors)
            dbErr(ex.errors[field].message);
        //dbErr(ex.message);    //This one combines all of them in one message
    }
    finally{
        next(result);
    }
}
module.exports.addDiver = addDiver;

async function updateDiver(id, name, seller, activity, next){
    setupConnection();

    dbDebugger(id);
    const diver = await Diver.findById(id);
    if(!diver){
        dbDebugger("Didn't find the diver");
        next(undefined);
        return;
    }
    var changes = 0;
    if(diver.name)    {diver.name     = name;     changes++;}
    if(diver.seller)  {diver.seller   = seller;   changes++;}
    if(diver.activity){diver.activity = activity; changes++;}

    if(changes > 0) {
        diver.save();
    }
    next(diver);
};
module.exports.updateDiver = updateDiver;

async function deleteDiver(id, next) {
    setupConnection();
    const result = await Diver.deleteMany({_id: id});
    next(result);
};
module.exports.deleteDiver = deleteDiver;

async function updateAllDivers(param, valuePre, valuePost){
    setupConnection();
};
module.exports.diverModel = Diver;



