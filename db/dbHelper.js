const mongoose = require('mongoose');
const dbConnection = mongoose.connection;
const dbDebugger = require('debug')('db:helper');
const dbErr = require('debug')('app:err');

//Needed variables to connect
uri = "mongodb://localhost:27017/divingApp";
const options = {
    useNewUrlParser: true,
    keepAlive: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 100,
    keepAliveInitialDelay: 1000
};

async function setupConnection(){
    dbDebugger('setupConnection');
    if(dbConnection._readyState != 1){    //Default 0, Connected 'db.once'-> 1
        dbDebugger('Connecting to DB');
        let err = await mongoose.connect(uri, options)
                      .then(() => dbDebugger( 'Connected' ))
                      .catch( (err) => dbErr("Could not connect "+err)
        );
    }
    //db.on((err) => dbErr('Could not connect to DB \n' + err));
    dbConnection.once(('open'), function(){
        dbDebugger('Connected to the DB');
    });
};

async function getItem (id, model, next){
    await setupConnection();
    if(mongoose.connection.readyState != 1)
        return(false)
    const result = await model.find({_id: id});
    dbDebugger('getItem retrieved \n' +result)
    next(result);
}

async function getItemSelectParams (objectToFind, model, params, next){
    await setupConnection();
    if(mongoose.connection.readyState != 1)
        return(false)
    const result = await model.find(objectToFind).select(params);
    dbDebugger('Item retrieved \n' +result)
    next(result);
}

async function getItemPopulated (id, model, fieldToPopulate, 
                                    selectedPopulatedFields="", itemFields="", next){
    await setupConnection();
    if(mongoose.connection.readyState != 1)
        return(false)
    const result = await model.find({_id: id})
                               .populate(fieldToPopulate, " "+selectedPopulatedFields)
                               .select(itemFields);
    dbDebugger('Populated retrieved \n' +result)
    next(result);
}

async function addItem(params, model, next){
    await setupConnection();
    if(mongoose.connection.readyState != 1){
        dbDebugger("addItem - Connection state: "+mongoose.connection.readyState)
        return(false)
    }
    dbDebugger("addItem - connected")
    const newItem = new model(params);
    dbDebugger(newItem);

    var result;
    try{
        result = await newItem.save();     //Here is where the validation is performed
        dbDebugger("addItem retrieved "+result)
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

async function updateItem(id, model, params, next){
    await setupConnection();
    if(mongoose.connection.readyState != 1)
        return(false)
    dbDebugger(id);
    //Check it exists
    const item = await model.findById(id);
    if(!item){
        dbDebugger("Didn't find the item");
        next(undefined);
        return;
    }
    dbDebugger("updateItem retrieved "+item)
    for (var field in model.schema.paths) {
        if ((field !== '_id') && (field !== '__v')) {
           if (params[field] !== undefined) {
              item[field] = params[field];
           }  
        }  
     } 
    result = await item.save()
    next(result);
};

async function deleteItem(id, model, next) {
    let connection = await setupConnection();
    if(connection == false)
        return(false)
    const result = await model.deleteMany({_id: id});
    dbDebugger("deleteItem retrieved "+result)
    next(result);
};

module.exports.setupConnection = setupConnection;
module.exports.getItemPopulated = getItemPopulated;
module.exports.getItem = getItem;
module.exports.addItem = addItem;
module.exports.connection = dbConnection;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;
module.exports.getItemSelectParams = getItemSelectParams;
