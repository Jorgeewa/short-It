var mongoose = require('mongoose');
var User = require ('../datasets/users');
var User = mongoose.model('User');
var Celebrity = require('../datasets/celebrity');


module.exports.topTraders = function (req, res){

    getLastPrices = function(celebrity, returns){
        celebrity.find()
            .exec(function(error, results){
                var lastPrices = {};
                results.forEach(function(data){
                lastPrices[data.celebrityName] = data.history[data.history.length-1].lastPrice;
                    console.log(lastPrices[data.celebrityName], data.history[data.history.length-1].lastPrice);
            })
                returns(lastPrices);
        })
    }

    returns = function(lastPrices){
        var topTraders = [];
        var valueofOpenTrades = 0;
        console.log(lastPrices);

        User.find()
            .exec(function(error, allUsers){
                        allUsers.forEach(function(user){
                            var valueofOpenTrades = 0;
                            user.openTrades.forEach(function(openTrades){
                                valueofOpenTrades = valueofOpenTrades + (openTrades.volume * openTrades.price) - (openTrades.volume * lastPrices[openTrades.celebrity]);
                                console.log(valueofOpenTrades, openTrades.volume, openTrades.price, lastPrices[openTrades.celebrity]);
                            });

                            currentValue = user.accountValue + valueofOpenTrades;
                            returns = ((currentValue - user.accountValueInit) / user.accountValueInit) * 100;
                            topTraders.push({
                                nickName : user.userName,
                                returns : returns
                            })
                    })
                        res.json({
                            topTraders : topTraders
                        });
                })
    }
    getLastPrices(Celebrity, returns);
    
}