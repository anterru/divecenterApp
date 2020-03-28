const mongoose = require('mongoose');
const dbConnection = mongoose.connection;
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

setupConnection = function(){
    dbDebugger('setupConnection');
    if(dbConnection._readyState != 1){    //Default 0, Connected 'db.once'-> 1
        dbDebugger('Connecting to DB');
        mongoose.connect(uri, options, function(err){
            if(err){
                dbErr('Could not connect to the DB');
                return(undefined);
            }
        });
        //db.on((err) => dbErr('Could not connect to DB \n' + err));
        dbConnection.once(('open'), function(){
            dbDebugger('Connected to the DB');
        });
    }
};
module.exports.connection = dbConnection;
module.exports.setupConnection = setupConnection;
