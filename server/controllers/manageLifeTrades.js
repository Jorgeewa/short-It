module.exports = ManageLifeTrades;

var moment = require('moment');

function ManageLifeTrades(celebrity, req){
    this.celebrity = celebrity;
    this.req = req;
    console.log(req);
    storeIfNegative = [];
}

ManageLifeTrades.prototype.stopLoss = function(){
    console.log("I ran in the stop loss")
    //only gets called if we have a buy or short order and user cannot place stops in between my spreads
    //change to a for loop
    this.celebrity.stopLoss.filter(function(trade, index){
        if (trade.price <= this.celebrity.bid && trade.typeofTrade === "buy"
        || trade.price >= this.celebrity.ask && trade.typeofTrade === "short"){
            this.updateUserTradeHistory(trade, trade.stopLoss.userId);
            this.updateValues(trade);
            this.celebrity.stopLoss.splice(index,1);
        }
    }) //you should work on when a user with a stop loss or take profit decides to close himself
}

ManageLifeTrades.prototype.takeProfit = function(){
    //only gets called if we hava a buy or short order
    console.log("I ran in the take profit");
    this.celebrity.takeProfit.filter(function(trade, index){
        if(trade.price >= this.celebrity.bid && trade.typeofTrade === "buy" 
        || trade.price <= this.celebrity.ask && trade.typeofTrade === "short"){
            this.updateUserTradeHistory(trade, trade.takeProfit.userId);
            this.updateValues(trade);
            this.celebrity.takeProfit.splice(index,1);
        }
    }) //you should work on when a user with a stop loss or take profit decides to close himself
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

ManageLifeTrades.prototype.updateUserTradeHistory = function(userId, userDatabase){
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
                        break;
                    case "cover" :
                        checkSellandCover(userData, 'short', self);
                        break;
                }
                
            } else {
                userData.accountValue = parseFloat(userData.accountValue) - parseFloat(self.req.price * self.req.quantity);
                userData.openTrades.push({
                    time : Date(),
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

/*manageLifeTrade.updateTrades.prototype = function(){
    //reduce quantity previously opened and update stop loss and take profit
}*/ //no longer needed

/*manageLifeTrade.removeStopsAndTP.prototype = function(trade, userId){
    //for situations where user just closes the trade himself
    celebrity.stopLoss.filter(function(trade){
        if(trade.userId = userId)
            return index;
    })   
}*/

ManageLifeTrades.prototype.updateValues = function(trade){
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

checkSellandCover = function(userData, typeofTrade){
    console.log(typeofTrade)
    trade = userData.openTrades.filter(function(trades){
        if(self.celebrity.celebrityName == self.req.celebrityName && trades.typeofTrade == typeofTrade)
            return trades; 
    }).map(function(filteredTrades){
        return filteredTrades.volume;
    }).reduce(function(mappedA, mappedB){
        return mappedA + mappedB
    });
    console.log(trade, self.req.quantity, trade == self.req.quantity);
    if(parseInt(trade) == parseInt(self.req.quantity)){
        for(var i = userData.openTrades.length -1; i >= 0; i--){
            console.log('I ran here')
            console.log(userData.openTrades[i].celebrity, self.req.celebrityName,userData.openTrades[i].typeofTrade);
            if(userData.openTrades[i].celebrity == self.req.celebrityName && userData.openTrades[i].typeofTrade == typeofTrade){
                userData.openTrades.splice(i, 1);
                console.log(i);
            }
        }
    } else {
        for(var i = userData.openTrades.length -1; i >= 0; i--){
            console.log('I ran here')
            console.log(userData.openTrades[i].celebrity, self.req.celebrityName,userData.openTrades[i].typeofTrade);
            if(userData.openTrades[i].celebrity == self.req.celebrityName && userData.openTrades[i].typeofTrade == typeofTrade){
                userData.openTrades.splice(i, 1);
                console.log(i);
            }
        }
        userData.openTrades.push({
            time : Date(),
            celebrity : self.celebrity.celebrityName,
            price : self.req.price,
            typeofTrade : typeofTrade,
            volume : trade - self.req.quantity
        })
        
        
    }
    userData.save();
}

/*spliceTrades = function(user, celebrity , req, self){
    var spliceArray = [];
    celebrity.openTrades.filter(function(trades, index){
            if(self.celebrity.celebrityName == self.req.celebrityName && trades.typeofTrade == typeofTrade){
                console.log("I meet the condition")
                spliceArray.push(index);
            }
    });
    
    for(var i = self.celebrity.openTrades.length; i <= 0; i--){
            if(self.celebrity.openTrades[i].celebrity == self.req.celebrityName && trades.typeofTrade == typeofTrade){
                self.celebrity.openTrades.splice(index, 1);
            }
    }
}*/