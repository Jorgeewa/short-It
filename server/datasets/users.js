var mongoose = require('mongoose');
module.exports = mongoose.model('user',{
    email : String,
    password : String,
    nickname : String,
    history : [{
        time : Date,
        celebrity : String,
        price : Number,
        typeofTrade : String,
        volume : Number
    }],
    accountValueInit : Number,
    accountValue : Number,
    openTrades : [{
        time : Date,
        celebrity : String,
        price : Number,
        typeofTrade : String,
        volume : Number
    }]
});