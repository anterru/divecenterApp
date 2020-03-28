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

const Staff = mongoose.model('StaffTest', staffSchema);

async function getFromDB (id, next) {
    await db.setupConnection();
    const result = await Staff.find({_id: id});
    dbDebugger('Retrieved \n' +result)
    next(result);
};
module.exports.getFromDB = getFromDB;

async function addStaff(params, next){
    await db.setupConnection();
    //dbDebugger(params);
    const newStaff = new Staff(params);
    //dbDebugger("staff is: " + newStaff);

    var result;
    try{
        result = await newStaff.save();     //Here is where the validation is performed
        dbDebugger('Added');
    }
    catch(ex){
        result = undefined
        for (field in ex.errors)
            dbErr(ex.errors[field].message);
        dbErr(ex.message);    //This one combines all of them in one message
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
