const mongoose = require('mongoose');
//const db = mongoose.connection;
const db = require('./dbHelper');
const dbDebugger = require('debug')('app:db');
const dbErr = require('debug')('app:err');

//Diver schema on DB
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
        enum: ["English", "French", "Spanish", "German", "Italian"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;  //First check to check it is not null
            },
            message: 'At least one valid language should be specified'
        }
    },
    agency: {
        type: [String],
        required: true,
        enum: ["SSI", "PADI"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;  //First check to check it is not null
            },
            message: 'At least one valid agency should be specified'
        }
    }
});
module.exports.Staff = mongoose.model('staff', staffSchema); //This is a class

async function getFromDB (id, next) {
    await db.setupConnection();
    const result = await Staff.find({_id: id});
    dbDebugger('Retrieved \n' +result)
    next(result);
};
module.exports.getFromDB = getFromDB;

async function addStaff(name, languages, agency, next){
    await db.setupConnection();
    const newStaff = new Staff({    //It checks every param is correct before saving
        name: name,
        languages: languages,
        agency: agency
    });
    dbDebugger("staff is: " + newStaff);

    var result;
    try{
        result = await newStaff.save();     //Here is where the validation is performed
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
module.exports.addStaff = addStaff;

async function updateStaff(id, name, languages, agency, next){
    setupConnection();

    dbDebugger(id);
    const staff = await Staff.findById(id);
    if(!staff){
        dbDebugger("Didn't find the diver");
        next(undefined);
        return;
    }
    var changes = 0;
    if(staff.name)    {staff.name     = name;     changes++;}
    if(staff.languages)  {staff.languages   = languages;   changes++;}
    if(staff.agency){staff.agency = agency; changes++;}

    if(changes > 0) {
        staff.save();
    }
    next(staff);
};
module.exports.updateStaff = updateStaff;

async function deleteStaff(id, next) {
    setupConnection();
    const result = await Staff.deleteMany({_id: id});
    next(result);
};
module.exports.deleteStaff = deleteStaff;

async function updateAllDivers(param, valuePre, valuePost){
    setupConnection();
};
//module.exports.staffModel = Staff;
//module.exports.staffSchema = staffSchema;
