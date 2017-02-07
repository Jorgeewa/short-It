var mongoose = require('mongoose');
var User = require('../datasets/users')
var User = mongoose.model('User');
var Celebrity = require('../datasets/celebrity');

module.exports.openTrades = function(req, res){
    returns = function(lastPrices){
        User.findById(req.body.userId, function(error, userData){
            console.log(userData, req.body.userId)
            if(error)
                console.log(error)
            else {
                var openTrades = [];
                userData.openTrades.forEach(function (trade){
                    openTrades.push({
                        time : trade.time,
                        typeofTrade : trade.typeofTrade,
                        celebrity : trade.celebrity,
                        volume : trade.volume,
                        price : trade.price,
                        profit : trade.volume * trade.price - trade.volume * lastPrices[trade.celebrity]
                    })
                })

                console.log(openTrades);
                res.json({
                    openTrades : openTrades
                });

            }

        })
    }
    getLastPrices = function(celebrity, returns){
    
        celebrity.find()
            .exec(function(error, results){
                var lastPrices = {};
                results.forEach(function(data){
                lastPrices[data.celebrityName] = data.history[data.history.length-1].lastPrice;
            })
            returns(lastPrices);
        })
    }
    getLastPrices(Celebrity, returns);
}

module.exports.tradeHistory = function(req, res){
    User.findById(req.body.userId, function(error, userData){
        if(error)
            console.log(error)
        else
            res.json({user : userData});
    });
}

module.exports.accountBalance = function(req, res){
    User.findById(req.body.userId, function(error, userData){
        if(error)
            console.log(error)
        else
            res.json({user : userData});
    });
}

