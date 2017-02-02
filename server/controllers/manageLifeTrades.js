module.exports = ManageLifeTrades;

var moment = require('moment');

function ManageLifeTrades(celebrity, req){
    this.celebrity = celebrity;
    this.req = req;
    console.log(req);
    storeIfNegative = [];
}

ManageLifeTrades.prototype.stopLoss = function(userDataBase){
    console.log("I ran in the stop loss")
    //only gets called if we have a buy or short order and user cannot place stops in between my spreads
    //change to a for loop
    /*this.celebrity.stopLoss.filter(function(trade, index){
        if (trade.price <= this.celebrity.bid && trade.typeofTrade === "buy"
        || trade.price >= this.celebrity.ask && trade.typeofTrade === "short"){
            this.updateUserTradeHistory(trade, trade.stopLoss.userId);
            this.updateCelebrity(trade);
            this.celebrity.stopLoss.splice(index,1);
        }
    })*/ //you should work on when a user with a stop loss or take profit decides to close himself
    length = this.celebrity.stopLoss.length -1;
    for(length; length >=0; length--){
        if(this.celebrity.stopLoss[length].price >= this.celebrity.bid && this.celebrity.stopLoss.[length].typeofTrade == "buy"
          || this.celebrity.stopLoss[length].price <= this.celebrity.ask && this.celebrity.stopLoss.[length].typeofTrade == "short"){
            
           this.celebrity.history.push({
                time : Date(),
                lastPrice : (celebrity.stopLoss[i].typeofTrade == "buy") ? this.celebrity.bid : this.celebrity.ask,
                typeofTrade : celebrity.stopLoss[i].typeofTrade,
                volume : parseInt(celebrity.stopLoss[i].quantity)
            });

            this.celebrity.theHouse.push({
                time : Date(),
                typeofTrade : celebrity.stopLoss[i].typeofTrade,
                price : (celebrity.stopLoss[i].typeofTrade == "buy") ? this.celebrity.bid : this.celebrity.ask,
                volume : parseInt(celebrity.stopLoss[i].quantity)
            })
            
            this.updateOpenTrades(this.req.userId, userDataBase, {
                quantity : celebrity.stopLoss[i].quantity,
                typeofTrade : celebrity.stopLoss[i].typeofTrade,
                price : (celebrity.stopLoss[i].typeofTrade == "buy") ? this.celebrity.bid : this.celebrity.ask,
                tradeId : celebrity.stopLoss[i].tradeId
            })
            this.celebrity.stopLoss.splice(index,1);
    }
    
}

ManageLifeTrades.prototype.takeProfit = function(){
    //only gets called if we hava a buy or short order
    console.log("I ran in the take profit");
    length = this.celebrity.takeProift.length -1;
    for(length; length >=0; length--){
        if(this.celebrity.[length].price <= this.celebrity.bid && this.celebrity.takeProfit.[length].typeofTrade == "buy"
          || this.celebrity.takeProfit[length].price >= this.celebrity.ask && this.celebrity.takeProfit.[length].typeofTrade == "short"){
            
             this.celebrity.history.push({
                time : Date(),
                lastPrice : (celebrity.takeProfit[i].typeofTrade == "buy") ? this.celebrity.bid : this.celebrity.ask,
                typeofTrade : celebrity.takeProfit[i].typeofTrade,
                volume : parseInt(celebrity.takeProfit[i].quantity)
            });

            this.celebrity.theHouse.push({
                time : Date(),
                typeofTrade : celebrity.takeProfit[i].typeofTrade,
                price : (celebrity.takeProfit[i].typeofTrade == "buy") ? this.celebrity.bid : this.celebrity.ask,
                volume : parseInt(celebrity.takeProfit[i].quantity)
            })
            
            
            this.updateOpenTrades(this.req.userId, userDataBase, {
                quantity : celebrity.takeProfit[i].quantity,
                typeofTrade : celebrity.takeProfit[i].typeofTrade,
                price : (celebrity.takeProfit[i].typeofTrade == "buy") ? this.celebrity.bid : this.celebrity.ask,
                tradeId : celebrity.takeProfit[i].tradeId
            })
            this.celebrity.takeProfit.splice(index,1);
    }
}

ManageLifeTrades.prototype.shockPrice = function(time, req){
    //this function needs to execute every xhours I would go with 4 hours
    if(!this.celebrity.theHouse.shockPriceTime){
        this.celebrity.theHouse.shockPriceTime = time;
        this.celebrity.save();
        return 0;
    }
    if(moment(time).diff(moment(this.celebrity.theHouse.shockPriceTime, 'h') >= 4)){
        this.celebrity.theHouse.shockPriceTime = time;
        this.celebrity.save();
        this.celebrity.theHouse.filter(function(trade){
            if(moment(trade.time).diff(moment(time), 'h') >= 4 && trade.typeofTrade === "buy"){
                this.storeIfNegative.push(trade)
            }
        });
        
        var value = this.storeIfNegative.reduce(function(firstValue, secondValue){
            value = (firstValue.price * firstValue.volume) + (secondValue.price * secondValue.volume);
            totalVolume = firstValue.volume + secondValue.volume
            return {
                price : value,
                volume : totalVolume
            }
        });
            //you need to check if value is empty
        if(!value)
            return 0;
            
        var avgPrice = value.price/value.volume;
        totalValue = avgPrice * value.volume;
        currentValue = this.celebrity.history[this.celebrity.history.length - 1].lastPrice * value.volume;

        if(totalValue > currentValue)
            return this.storeIfNegative = [];
        else {
            if(currentValue/totalValue < 2)
                return this.storeIfNegative;
            else {
                setTimer(function(){
                    setTimer(function(){
                        setTimer(function(){
                            this.newTimedPrices(req);
                        },1000 * 60 * 30);

                        this.newTimedPrices(req);
                    }, 1000 * 60 * 60);

                    this.newTimedPrices(req);
                }, 1000 * 60 * 60 * 2)
            }
        }
        
        
    } else {
        return 0;
    }
    
}

ManageLifeTrades.prototype.updateUserTradeHistory = function(userId, userDatabase, tradeIdIndex){
    self = this;
    userDatabase.findById(userId, function(error, userData){
        if(error){
            console.log(error);
        } else {
            userData.history.push({
                time : Date(),
                celebrity : self.celebrity.celebrityName,
                price : self.req.price,
                typeofTrade : self.req.typeofTrade,
                volume : self.req.quantity
            });
            if(self.req.typeofTrade == "sell" || self.req.typeofTrade == "cover"){
                userData.accountValue = parseFloat(userData.accountValue) + parseFloat(self.req.price * self.req.quantity);
                switch(self.req.typeofTrade){
                    case "sell" :
                        checkSellandCover(userData, 'buy', self);
                        removeStops(self.celebrity, userId, 'sell');
                        removeTakeProfits(self.celebrity, userId, 'sell');
                        break;
                    case "cover" :
                        checkSellandCover(userData, 'short', self);
                        removeStops(self.celebrity, userId, 'cover');
                        removeTakeProfits(self.celebrity, userId, 'cover');
                        break;
                }
                
            } else {
                userData.accountValue = parseFloat(userData.accountValue) - parseFloat(self.req.price * self.req.quantity);
                userData.openTrades.push({
                    time : Date(),
                    tradeId : tradeIdIndex,
                    celebrity : self.celebrity.celebrityName,
                    price : self.req.price,
                    typeofTrade : self.req.typeofTrade,
                    volume : self.req.quantity
                })
                
                userData.save();
            }
            
        }
    })
}


ManageLifeTrades.prototype.updateCelebrity = function(trade){
    //should not be able to place stops in between my spread
    var tradeDirection = (trade.typeofTrade == "buy") ? "sell" : "cover";
    
    this.celebrity.history.push({
        time : Date(),
        lastPrice: trade.price,
        typeofTrade : tradeDirection, //potential error here should be opposite of this trade corrected
        volume : trade.volume
    });
    
    this.celebrity.theHouse.push({
        time : Date(),
        typeofTrade : tradeDirection,
        price : trade.price,
        volume : trade.volume
    })
    
    if(trade.typeofTrade == "sell" || trade.typeofTrade == "short"){
        var totalOutstanding = parseInt(this.celebrity.totalOutstanding) + parseInt(trade.volume);
        this.celebrity.totalOutstanding = totalOutstanding;
    } else{
        var totalOutstanding = parseInt(this.celebrity.totalOutstanding) - parseInt(trade.volume);
        this.celebrity.totalOutstanding = totalOutstanding;
    }
    
    this.celebrity.save();
    
    //remember to update House
}
ManageLifeTrade.prototype.updateOpenTrades = function(userId, userDataBase, req){
    //removeStops(this.celebrity, this.req.userId, this.req.typeofTrade, this.req.tradeId);
    //removeTakeProfits(this.celebrity, this.req.userId, this.req.typeofTrade, this.req.tradeId);
    self = this;
    userDatabase.findById(userId, function(error, userData){
        if(error){
            console.log(error);
        } else {
            userData.history.push({
                time : Date(),
                celebrity : self.celebrity.celebrityName,
                price : req.price,
                typeofTrade : req.typeofTrade,
                volume : .req.quantity
            });
            if(req.typeofTrade == "buy" || req.typeofTrade == "short"){
                userData.accountValue = parseFloat(userData.accountValue) + parseFloat(req.price * req.quantity);
                switch(req.typeofTrade){
                    case "buy" :
                        checkSellandCover(userData, 'buy', self, req.tradeId);
                        removeStops(self.celebrity, userId, 'sell', req.tradeId);
                        removeTakeProfits(self.celebrity, userId, 'sell', req.tradeId);
                        break;
                    case "short" :
                        checkSellandCover(self.req.userData, 'short', self, req.tradeId);
                        removeStops(self.celebrity, self.req.userId, 'cover', req.tradeId);
                        removeTakeProfits(self.celebrity, self.req.userId, 'cover', req.tradeId);
                        break;
                }
                
            }
            
        }
    })
}
ManageLifeTrades.prototype.newTimedPrices = function(req){
    randNumber = Math.random() * 10;
    randNumberModulus = randNumber % 11;
    randNumberFloor = Math.floor(randNumberModulus);
    var shockPercentage = (100 - randNumber)/100;
    this.celebrity.bid = this.celebrity.bid * shockPercentage;
    this.celebrity.ask = this.celebrity.bid + 2.02;
    this.celebrity.history.push({
        time : Date(),
        lastPrice : this.celebrity.bid,
        typeofTrade : "sell",
        volume : Math.floor(100000 * Math.random())
    });
    this.takeProfit();
    this.stopLoss();
    var io = req.app.get('socket.io')
    
    io.emit('priceShock', {
        bid : this.celebrity.bid
    })
    this.celebrity.save();
}//find a way to send these new prices to users. I did not modify volume on purpose and I did not update House too on purpose

checkSellandCover = function(userData, typeofTrade, self, tradeId){
    if(tradeId){
        for(var i = userData.openTrades.length -1; i >= 0; i--){
            if(userData.openTrades[i].celebrity == self.req.celebrityName && userData.openTrades[i].typeofTrade == typeofTrade && userData.opentTrades[i].tradeId == tradeId){
                userData.openTrades.splice(i, 1);
            }
        };
        userData.save();
        }
    } else {
        trade = userData.openTrades.filter(function(trades){
            if(trades.celebrity == self.req.celebrityName && trades.typeofTrade == typeofTrade){
                console.log(trades);
                return trades;
            }
        }).map(function(filteredTrades){
            return filteredTrades.volume;
        }).reduce(function(mappedA, mappedB){
            return parseInt(mappedA) + parseInt(mappedB);
        });
        console.log(trade, self.req.quantity, trade == self.req.quantity);
        if(parseInt(trade) == parseInt(self.req.quantity)){
            for(var i = userData.openTrades.length -1; i >= 0; i--){
                console.log('I ran here')
                console.log(userData.openTrades[i].celebrity, self.req.celebrityName,userData.openTrades[i].typeofTrade);
                if(userData.openTrades[i].celebrity == self.req.celebrityName && userData.openTrades[i].typeofTrade == typeofTrade){
                    userData.openTrades.splice(i, 1);
                }
            };
        userData.save();
        } else {
            for(var i = userData.openTrades.length -1; i >= 0; i--){
                console.log('I ran here')
                console.log(userData.openTrades[i].celebrity, self.req.celebrityName,userData.openTrades[i].typeofTrade);
                if(userData.openTrades[i].celebrity == self.req.celebrityName && userData.openTrades[i].typeofTrade == typeofTrade){
                    userData.openTrades.splice(i, 1);
                }
            };
            userData.save();
            console.log(trade, userData.openTrades);
            userData.openTrades.push({
                time : Date(),
                tradeId : self.req.tradeId,
                celebrity : self.celebrity.celebrityName,
                price : self.req.price,
                typeofTrade : typeofTrade,
                volume : parseInt(trade) - parseInt(self.req.quantity)
            })


        }
        userData.save();
    }
}

removeStops = function(celebrity, userId, typeofTrade, tradeId){
    var typeofTrade = (typeofTrade == 'sell') ? 'buy' : 'short';
    if(tradeId == null){
        length = celebrity.stopLoss.length -1;
        for(i = length; i >= 0; i--){
            if(celebrity.stopLoss.userId == userId && celebrity.typeofTrade == typeofTrade){
                celebrity.stopLoss.splice(i,1);
            }
        }
    
    } else {
        length = celebrity.stopLoss.length -1;
        for(i = length; i >= 0; i--){
            if(celebrity.stopLoss.userId == userId && celebrity.typeofTrade == typeofTrade && celebrity.stopLoss.tradeId == tradeId){
                celebrity.stopLoss.splice(i,1);
            }
        }
    
    }
    celebrity.save();
}

removeTakeProfits = function(celebrity, userId, typeofTrade, tradeId){
    var typeofTrade = (typeofTrade == 'sell') ? 'buy' : 'short';
    if(tradeId == null){
        length = celebrity.takeProfit.length -1;
        for (length; length >= 0; length--){
            if(celebrity.takeProfit.userId == userId && celebrity.typeofTrade == typeofTrade){
                celebrity.takeProfit.splice(i,1);
            }
        }
    } else {
        length = celebrity.takeProfit.length -1;
        for (length; length >= 0; length--){
            if(celebrity.takeProfit.userId == userId && celebrity.typeofTrade == typeofTrade && celebrity.stopLoss.tradeId == tradeId){
                celebrity.takeProfit.splice(i,1);
            }
        }
    }
}
