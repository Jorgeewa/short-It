var Celebrity = require('../datasets/celebrity');
var mongoose = require('mongoose');
var User = require('../datasets/users')
var User = mongoose.model('User');
var ManageLifeTrades = require('./manageLifeTrades');

module.exports.computeNewPrice = function(req, res){
    var quantity = req.body.quantity;
    
    Celebrity.find({celebrityName : req.body.celebrityName}, function(error, results){
        if(error){
            console.log(error)
        } else {
            
            results = results[0];
            bid = results.bid;
            ask = results.ask;
            outstandingShares = results.totalOutstanding;
            percentageOfTotal = quantity/outstandingShares;
            randNumber = 0.001 * (percentageOfTotal * (Math.floor((Math.random() * 10) % 10)));
            percentageIncrement = (-0.2 * percentageOfTotal * percentageOfTotal) + (0.2 * percentageOfTotal) + randNumber;
            console.log(percentageIncrement, percentageOfTotal, outstandingShares, randNumber);
            User.findById(req.body.userId, function(error, userData){
                if(error){
                    console.log(error);
                } else {
                    console.log(userData);
                    console.log(userData.openTrades.length, req.body.typeofTrade == 'cover');
                    accountBalance = userData.accountValue;
                    if(userData.openTrades.length > 0 && req.body.typeofTrade == 'sell'){
                        outstandingVolumeSell = getOutstandingVolume(userData.openTrades, "buy", req) || 0;//null could be a problem here
                        console.log(outstandingVolumeSell);
                    } else {
                        outstandingVolumeSell = 0;
                    }
                    if(userData.openTrades.length > 0 && req.body.typeofTrade == 'cover'){
                        console.log("I ran here")
                        outstandingVolumeCover = getOutstandingVolume(userData.openTrades, "short", req) || 0;
                        console.log(outstandingVolumeCover);
                    } else {
                        outstandingVolumeCover = 0;
                    }
                    switch(req.body.typeofTrade){
                        case "buy" :
                            ask = ask * (percentageIncrement + 1);
                            console.log(quantity, ask, quantity * ask, "I executed here", parseFloat(accountBalance) >= parseFloat(quantity) * parseFloat(ask));
                            if(accountBalance >= quantity * ask && ask > 0)
                                res.json({price : ask});
                            else {
                                res.json({
                                    error : "not enough money"
                                })
                            }
                            break;

                        case "sell" :
                            bid = bid * (1 - percentageIncrement);
                            console.log(outstandingVolumeSell)
                            if(outstandingVolumeSell >= quantity && ask > 0)
                                res.json({price : bid});
                            else{
                                res.json({
                                    error : "if you want to short sell click on short"
                                })
                            }
                            break;

                        case "short" :
                            bid = bid * (1 - percentageIncrement);
                            if(accountBalance >= quantity * bid && ask > 0)
                                res.json({price : bid});
                            else {
                                res.json({
                                    error : "not enough money"
                                })
                            }
                            break;

                        case "cover" :
                            ask = ask * (percentageIncrement + 1);
                            if(outstandingVolumeCover >= quantity && ask > 0)
                                res.json({"price" : ask});
                            else {
                                res.json({
                                    error : "check your trades"
                                })
                            }
                            break;
                    }
                    
                }
            });
            
            
            
            
        }
    })
    
    
}

module.exports.updatePrice = function(req, res){
    Celebrity.find({celebrityName : req.body.celebrityName}, function(error, results){
        results = results[0];
        if(req.body.typeofTrade == "sell" || req.body.typeofTrade == "short"){
            console.log(req.body.price);
            console.log(typeof(req.body.price), ask);
            bid = req.body.price;
            ask = bid - 0 + 2.02;
            var totalOutstanding = parseInt(results.totalOutstanding) + parseInt(req.body.quantity);
            results.totalOutstanding = totalOutstanding;
        } else {
            ask = req.body.price;
            console.log(ask, bid);
            bid = ask - 2.02;
            var totalOutstanding = parseInt(results.totalOutstanding) - parseInt(req.body.quantity);
            console.log(totalOutstanding);
            results.totalOutstanding = totalOutstanding;
            console.log(totalOutstanding, results.totalOutstanding);
        }
        
        results.bid = bid;
        results.ask = ask;
        results.history.push({
            time : Date(),
            lastPrice : req.body.price,
            typeofTrade : req.body.typeofTrade,
            volume : parseInt(req.body.quantity)
        });
        
        results.theHouse.push({
            time : Date(),
            typeofTrade : String,
            price : req.body.price,
            volume : parseInt(req.body.quantity)
        })
        
        results.save(function(error){
            console.log("this is the bid ", bid, " and this is the ask ", ask);
            console.log(req.body.price);
            if(error)
                console.log(error);
            else {
                res.json({
                    bid : bid,
                    ask : ask
                })
            }
        });
        manageLifeTrades = new ManageLifeTrades(results, req.body);
        manageLifeTrades.updateUserTradeHistory(req.body.userId, User);
        manageLifeTrades.stopLoss();
        manageLifeTrades.takeProfit();
        manageLifeTrades.shockPrice(Date(), req);
        
    })
    
        var io = req.app.get('socket.io');
        
        io.emit('priceShock', {
            bid : bid
        })
}

getOutstandingVolume = function(trade, typeofTrade, req){
    console.log(req.body, trade)
    return trade.filter(function(trades){
        
    if(trades.celebrity == req.body.celebrityName && trades.typeofTrade == typeofTrade)
        return trades;
    }).map(function(filteredTrades){
            return filteredTrades.volume;
        }).reduce(function(mappedA, mappedB){
            return mappedA + mappedB;
            }, 0);
}

/*setInterval(function(){
    manageLifeTrades.shockPrice(Date());
}, 1000 * 60 * 60 * 3);
*/
    