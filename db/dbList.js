const mongoose = require('mongoose');
const dbConnection = mongoose.connection;
const dbDebugger = require('debug')('app:db');
const dbErr = require('debug')('app:err');
const db = require('./dbHelper');

async function getItemPopulated (id, model, next){
    db.setupConnection();
    const result = await model.find({_id: id})
                    .populate("activities.divers.name", "name")
                    .populate("activities.staff.name -_id", "name")
                    .populate("activities.divers.soldBy.staff", "name")
                    .populate("briefing -_id", "name")
                    .populate("packing.name -_id", "name");
                    //.select()

    dbDebugger('Populated retrieved \n' +result)
    next(result);
}
module.exports.getItemPopulated = getItemPopulated;