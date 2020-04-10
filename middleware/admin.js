
const auth = require('./auth');

module.exports = function(req, res, next){
    auth(req, res, function(){
        if (!req.user.isAdmin) return res.status(403).send("Forbidden");
    })
    next();
}