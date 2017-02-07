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
                    accountBalance = userData.accountValue;
                    if(userData.openTrades.length > 0 && req.body.typeofTrade == 'sell'){
                        outstandingVolumeSell = getOutstandingVolume(userData.openTrades, "buy", req) || 0;//null could be a problem here
                    } else {
                        outstandingVolumeSell = 0;
                    }
                    if(userData.openTrades.length > 0 && req.body.typeofTrade == 'cover'){
                        console.log("I ran here")
                        outstandingVolumeCover = getOutstandingVolume(userData.openTrades, "short", req) || 0;
                    } else {
                        outstandingVolumeCover = 0;
                    }
                    switch(req.body.typeofTrade){
                        case "buy" :
                            ask = ask * (percentageIncrement + 1);
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
            bid = req.body.price;
            ask = bid - 0 + 2.02;
            var totalOutstanding = parseInt(results.totalOutstanding) + parseInt(req.body.quantity);
            results.totalOutstanding = totalOutstanding;
        } else {
            ask = req.body.price;
            bid = ask - 2.02;
            var totalOutstanding = parseInt(results.totalOutstanding) - parseInt(req.body.quantity);
            results.totalOutstanding = totalOutstanding;
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
            typeofTrade : req.body.typeofTrade,
            price : req.body.price,
            volume : parseInt(req.body.quantity)
        });     
        results.save(function(error){
            if(error)
                console.log(error);
            else {
                res.json({
                    bid : bid,
                    ask : ask
                })
            }
        });
        
        tradeIdIndex = results.history[results.history.length - 1]._id;
        if(typeofTrade == 'short'){
            results.shortInterest.push({
                time : Date(),
                price : req.body.price,
                tradeId : tradeIdIndex,
                typeofTrade : req.body.typeofTrade,
                quantity : req.body.quantity,
                userId : req.body.userId
            })
            results.save();
        }
        
        manageLifeTrades = new ManageLifeTrades(results, req.body);
        manageLifeTrades.updateUserTradeHistory(req.body.userId, User, tradeIdIndex);
        manageLifeTrades.stopLoss(User);
        manageLifeTrades.takeProfit(User);
        manageLifeTrades.shockPrice(Date(), req);
        manageLifetrades.shortInterest(User);
        
    })
    
        var io = req.app.get('socket.io');
        
        io.emit('priceShock', {
            bid : bid
        })
}

module.exports.closeOpenTrade = function(req, res){
    Celebrity.find({celebrityName : req.body.celebrityName}, function(error, results){
        results = results[0];
            outstandingShares = results.totalOutstanding;
            percentageOfTotal = req.body.quantity/outstandingShares;
            randNumber = 0.001 * (percentageOfTotal * (Math.floor((Math.random() * 10) % 10)));
            percentageIncrement = (-0.2 * percentageOfTotal * percentageOfTotal) + (0.2 * percentageOfTotal) + randNumber;
        if(req.body.typeofTrade == "short"){
            var totalOutstanding = parseInt(results.totalOutstanding) + parseInt(req.body.quantity);
            results.ask = results.ask * (1 + percentageIncrement);
            results.bid = results.ask - 2.02;
            results.totalOutstanding = totalOutstanding;
            var typeofTrade = 'cover';
            results.history.push({
                time : Date(),
                lastPrice : results.ask,
                typeofTrade : typeofTrade,
                volume : parseInt(req.body.quantity)
            });

            results.theHouse.push({
                time : Date(),
                typeofTrade : typeofTrade,
                price : results.ask,
                volume : parseInt(req.body.quantity)
            })
            newReq = {
                quantity : req.body.quantity,
                typeofTrade : req.body.typeofTrade,
                price : results.ask,
                celebrityName : req.body.celebrityName,
                userId : req.body.userId,
                tradeId : req.body.tradeId
            }
        } else {
            var totalOutstanding = parseInt(results.totalOutstanding) - parseInt(req.body.quantity);
            results.bid = results.bid * (1-percentageIncrement);
            results.ask = parseInt(results.bid) + 2.02;
            results.totalOutstanding = totalOutstanding;
            var typeofTrade = 'sell';
            results.history.push({
                time : Date(),
                lastPrice : results.bid,
                typeofTrade : typeofTrade,
                volume : parseInt(req.body.quantity)
            });

            results.theHouse.push({
                time : Date(),
                typeofTrade : typeofTrade,
                price : results.bid,
                volume : parseInt(req.body.quantity)
            })
            
            newReq = {
                quantity : req.body.quantity,
                typeofTrade : req.body.typeofTrade,
                price : results.bid,
                celebrityName : req.body.celebrityName,
                userId : req.body.userId,
                tradeId : req.body.tradeId
            }
        }
        results.save();
        manageLifeTrades = new ManageLifeTrades(results, newReq);
        manageLifeTrades.updateOpenTrades(req.body.userId, User, newReq);
        manageLifeTrades.shortInterest(User);
        manageLifeTrades.stopLoss(User);
        manageLifeTrades.takeProfit(User);
        res.json({complete : 'complete'})

    })
}


module.exports.checkError = function(req, res){
    Celebrity.find({celebrityName : req.body.celebrityName}, function(error, results){
        if(!error){
            results = results[0];
            res.json({
                bid: results.bid,
                ask : results.ask
            })
        }
            
        
    })
}


module.exports.setStopsTakeProfits = function(req, res){
    Celebrity.find({celebrityName : req.body.celebrityName}, function(error, results){
        if(!error){
            results = results[0];
            if(req.body.type == 'takeProfit'){
                results.takeProfit.push({
                    userId : req.body.userId,
                    tradeId : req.body.tradeId,
                    typeofTrade : req.body.typeofTrade,
                    price: req.body.price,
                    quantity : req.body.quantity
                })
                
                User.findById(req.body.userId, function(error, userData){
                    if(!error){
                        userData.openTrades.filter(function(data){
                            if(data.tradeId == req.body.tradeId){
                                data.takeProfit = req.body.price;
                                userData.save();
                            }
                        })
                    }
                })
            } else {
                results.stopLoss.push({
                    userId : req.body.userId,
                    tradeId : req.body.tradeId,
                    typeofTrade : req.body.typeofTrade,
                    price: req.body.price,
                    quantity : req.body.quantity
                })
                
                User.findById(req.body.userId, function(error, userData){
                    if(!error){
                        userData.openTrades.filter(function(data){
                            if(data.tradeId == req.body.tradeId){
                                data.stopLoss = req.body.price;
                                userData.save();
                            }
                        })
                    }
                })
            }
            

            
            results.save();
            res.json({success: "it was successful"});
        }
    })
}
getOutstandingVolume = function(trade, typeofTrade, req){
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
    
