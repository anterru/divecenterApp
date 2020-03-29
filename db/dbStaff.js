const mongoose = require('mongoose');
//const db = mongoose.connection;
const db = require('./dbHelper');
const dbDebugger = require('debug')('app:db');
const dbErr = require('debug')('app:err');



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



async function updateAllDivers(param, valuePre, valuePost){
    setupConnection();
};
//module.exports.staffModel = Staff;
//module.exports.staffSchema = staffSchema;
