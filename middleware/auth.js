const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) res.status(401).send('Access denied. No token provided');

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex){  //In case the token is not correct, it throws an exception
        return res.status(400).send('Invalid token');
    }
}

module.exports.auth = auth;