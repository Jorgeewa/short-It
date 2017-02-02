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
            typeofTrade : req.body.typeofTrade,
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
        manageLifeTrades.stopLoss(req.body.userId, User);
        manageLifeTrades.takeProfit(User);
        manageLifeTrades.shockPrice(Date(), req);
        
    })
    
        var io = req.app.get('socket.io');
        
        io.emit('priceShock', {
            bid : bid
        })
}

module.exports.closeOpenTrade = function(req, res){
    Celebrity.find({celebrityName : req.body.celebrityName}, function(error, results){
        results = results[0];
        if(req.body.typeofTrade == "short"){
            var totalOutstanding = parseInt(results.totalOutstanding) + parseInt(req.body.quantity);
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
                typeofTrade : typeofTrade,
                price : results.ask,
                celebrityName : req.body.celebrityName,
                userId : req.body.user._id
            }
        } else {
            var totalOutstanding = parseInt(results.totalOutstanding) - parseInt(req.body.quantity);
            console.log(totalOutstanding);
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
                typeofTrade : typeofTrade,
                price : results.bid,
                celebrityName : req.body.celebrityName,
                userId : req.body.user._id
            }
        }
        results.save();
        manageLifeTrades = new ManageLifeTrades(results, newReq);
        manageLifeTrades.updateUserTradeHistory(req.body.userId, User);
        res.json({complete : 'complete'})

    })
}


module.exports.checkError = function(req, res){
    celebrity.find({req.body.celebrityName}, function(error, results){
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
    celebrity.find({req.body.celebrityName}, function(error, results){
        if(!error){
            results = results[0];
            if(req.body.type == 'takeProfits'){
                results.takeProfit.push({
                    userId : req.body.userId,
                    typeofTrade : req.body.typeofTrade,
                    price: req.body.Price,
                    quantity : req.body.quantity
                })
            } else {
                results.stopLoss.push({
                    userId : req.body.userId,
                    typeofTrade : req.body.typeofTrade,
                    price: req.body.Price,
                    quantity : req.body.quantity
                })
            }
            
            res.json({success: "it was successful"});
        }
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
    