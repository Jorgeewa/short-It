var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var mongoose = require('mongoose');
var Client = require('../datasets/client')
var Token = require('../datasets/token')

var User = mongoose.model('User');
var Client = mongoose.model('Client');

passport.use(new LocalStrategy(
    function(username, password, done){
    User.findOne({email : username}, function(error, user){
        if(error){
            console.log(error);
            return done(error);
        }
        
        if(!user){
            return done(null, false, {
                message : 'User not Found'
            });
        }
        
        if(!user.validPassword(password)){
            return done(null, false, {
                message : 'password is wrong'
            });
        }
        
        return done(null, user);
    })
}
));

passport.use(new BasicStrategy(
    function(username, password, callback) {
        Client.findOne({id : email}, function (error, client){
            if(error){return callback(error);}
            
            if(!client || client.secret !== password){return callback(null, false);}
            
            return callback(null, client);
        })
    }
));

passport.use(new BearerStrategy(function(accessToken, callback){
    Token.findOne({value: accessToken}, function(error, token){
        if(error){return callback(error)}
        
        if(!token){return callback(null, false);}
        
        User.findOne({_id : token.userId}, function(error, user){
            if(error){return callback(error);}
            
            if(!user){return call(null, false);}
        
            callback(null, user, {scope : 'x'});
            })
    })
}))