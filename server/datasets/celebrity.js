var mongoose = require('mongoose');
module.exports = mongoose.model('celebrity',{
    celebrityName: String,
    symbol : String,
    totalIssued : Number,
    totalOutstanding : Number,
    shortInterest : Number,
    bid : Number,
    ask : Number,
    history: [{time: Date,
              lastPrice: Number,
               typeofTrade : String,
               volume : Number
              }],
    
    stopLoss : [{
        userId : String,
        typeofTrade : String,
        price : Number,
        quantity : Number
    }],
    
    takeProfit : [{
        userId : String,
        typeofTrade : String,
        price : Number,
        quantity : Number
    }],
    
    theHouse : [{
        time : Date,
        typeofTrade : String,
        price : Number,
        volume : Number
    }]
});