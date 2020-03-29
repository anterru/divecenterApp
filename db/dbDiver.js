const mongoose = require('mongoose');
//const db = mongoose.connection;
const db = require('./dbHelper');
const dbDebugger = require('debug')('app:db');
const dbErr = require('debug')('app:err');
//const staffModel= require('./dbStaff').Staff;
    /*seller: {
        type: mongoose.Schema.Types.ObjectID,   //Also possible to refer to the Schema. Video 115
        ref: 'staff',
        required: true
    },
    mec: { type: String,
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
    },*/
//});
//const Diver = mongoose.model('divers', diverSchema); //This is a class



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

async function updateAllDivers(param, valuePre, valuePost){
    setupConnection();
};
module.exports.diverModel = Diver;



