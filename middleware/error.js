module.exports = function(err, req, res, next){
    res.status(500).send('Uups, something went wrong!');
}