var mongoose = require('mongoose');
module.exports = mongoose.model('celebrity',{
    celebrityName: String,
    symbol : String,
    totalIssued : Number,
    totalOutstanding : Number,
    image : String,
    about : String,
    shortInterest : [{
        time : Date,
        price : String,
        tradeId : String,
        typeofTrade : String,
        quantity : Number,
        userId : String
    }],
    bid : Number,
    ask : Number,
    history: [{time: Date,
              lastPrice: Number,
               typeofTrade : String,
               volume : Number
              }],
    
    stopLoss : [{
        userId : String,
        tradeId : String,
        typeofTrade : String,
        price : Number,
        quantity : Number
    }],
    
    takeProfit : [{
        userId : String,
        tradeId : String,
        typeofTrade : String,
        price : Number,
        quantity : Number
    }],
    
    theHouse : [{
        time : Date,
        typeofTrade : String,
        price : Number,
        volume : Number,
        shockPriceTime : Date
    }]
});
