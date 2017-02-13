var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email : {
        type: String,
        unique : true,
        require : true
    },
    userName : String,
    hash : String,
    salt : String,
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
        tradeId : String,
        celebrity : String,
        price : Number,
        typeofTrade : String,
        volume : Number,
        stopLoss : Number,
        takeProfit : Number
    }]
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
}

userSchema.methods.generateJwt = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    
    return jwt.sign({
        _id : this._id,
        userName : this.userName,
        exp : parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET");
}

module.exports = mongoose.model('User', userSchema);
