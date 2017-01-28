var passport = require('passport');
var mongoose = require('mongoose');

var User = mongoose.model('User');

module.exports.register = function(req, res){
    console.log(req.body.nickname);
    var num = 100000;
    //var user = new User(req.body);
    var user = new User;
    user.email = req.body.email;
    user.userName = req.body.nickname;
    user.setPassword(req.body.password);
    console.log(user);
    user.accountValueInit = 100000;
    user.accountValue =user.accountValueInit;
    console.log(user.accountValueInit);
    user.save(function(error){
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            token : token
        })
    });
}

module.exports.login = function(req, res){
    passport.authenticate('local', function(error, user, info){
        var token;
        
        if(error){
            res.status(400).json(error);
            return 0;
        }
        
        if(user){
            token = user.generateJwt();
            console.log(token, user);
            res.status(200);
            res.json({
                token : token
            }) 
        } else {
                res.status(401).json(info);
            }
    })(req, res);
}