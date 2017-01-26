var User = require('../datasets/users');

module.exports.openTrades = function(req, res){
    User.findById(req.body.userId, function(error, userData){
        console.log(userData, req.body.userId)
        if(error)
            console.log(error)
        else
            res.json({user : userData});
    })
}

module.exports.tradeHistory = function(req, res){
    User.findById(req.body.userId, function(error, userData){
        if(error)
            console.log(error)
        else
            res.json({user : userData});
    })
}