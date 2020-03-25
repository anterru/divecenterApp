const mongoose = require('mongoose');
const db = mongoose.connection;
const dbDebugger = require('debug')('app:db');
const dbErr = require('debug')('app:err');

//Needed variables to connect
uri = "mongodb://localhost:27017/divingApp";
const options = {
    useNewUrlParser: true,
    //autoReconnect: true,
    keepAlive: true,
    useUnifiedTopology: true,
    keepAliveInitialDelay: 300000
};

//Diver schema on DB
const diverSchema = mongoose.Schema({
    name:     { type: String,
                required: true,
                minlength: 1,
                maxlength: 100,
                lowercase: true,
                trim: true      //Remove white spaces from beginning and end
              },
    seller:   { type: String,
                required: true,
                minlength: 1,
                maxlength: 100
              },
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

setupConnection = function(){
    if(db._readyState != 1){    //Default 0, Connected 'db.once'-> 1
        dbDebugger('Connecting to DB');
        //initDB();
        mongoose.connect(uri, options)
            .then(() => {
                db.once('open'),    //Mark connection as open
                dbDebugger('Connected to DB')
            })
            .catch((err) => dbErr('Could not connect \n'+err))
    }
};

async function getFromDB (id, next) {
    setupConnection();
    const result = await Diver.findById(id);
    dbDebugger('Retrieved \n' +result)
    next(result);
};
module.exports.getFromDB = getFromDB;

async function addDiver(name, seller, activity, daysDiving, price, next){
    setupConnection();
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




