var passport = require('passport');
var mongoose = require('mongoose');
var request = require('request')

var User = mongoose.model('User');

module.exports.register = function(req, res){
    User.findOne({email : req.body.newUser.email}, function(err, success){
        if(success){
            console.log(success.email);
            return res.json({error: "email already exists"});
           
        } else {
            User.findOne({userName : req.body.newUser.nickname}, function(error, success){
                if(success){
                    console.log(success.userName)
                    return res.json({error : "user name already exists"})
                } else {
                    console.log("I am creating user", req.body)
                    var num = 100000;
                    //var user = new User(req.body);
                    var user = new User;
                    user.email = req.body.newUser.email;
                    user.userName = req.body.newUser.nickname;
                    user.setPassword(req.body.newUser.password);
                    user.accountValueInit = 100000;
                    user.accountValue =user.accountValueInit;
                    var nodebb_signup = 'http://127.0.0.1:4567/api/v1/users';
                      options = {
                        form: {
                            email : req.body.newUser.email,
                            username: req.body.newUser.nickname,
                            password: req.body.newUser.password,
                            _uid: 1
                        },
                        headers : {

                          '_uid' : 1,
                            'Authorization' : 'Bearer fc979aec-4b4e-4311-9951-17055710eff8'
                        }
                      };
                       /*userData = {
                            email : req.body.newUser.email,
                            username : req.body.newUser.nickname,
                            password : req.body.newUser.password,
                           _uid : 1
                        }*/
                      request.post(nodebb_signup, options, function(error, res) {
                        if(error)
                            console.log(error);
                          else
                              console.log(res.body, "success");
                      });
                    
                    
                    user.save(function(error){
                        var token;
                        token = user.generateJwt();
                        res.status(200);
                        res.json({
                            token : token
                        })
                    });
                }
        
            });
        }
    });
    
}

module.exports.login = function(req, res){
    console.log('George')
    passport.authenticate('local', function(error, user, info){
        var token;
        if(error){
            res.status(400).json(error);
            return 0;
        }
        
        if(user){
            token = user.generateJwt();
            res.status(200);
            var nodebb_login = 'http://127.0.0.1:4567/api/ns/login';
            options = {
                        form: {
                            username: user.userName,
                            password: req.body.password,
                            remember : 'on'
                        },
                        headers : {
                            'Cookie': req.headers.cookie,
                            'X-CSRF-Token': req.headers['x-csrf-token'] 
                        }
                      };
            console.log(req.headers['x-csrf-token'])
            request.post(nodebb_login, options, function(error, res) {
                if(error)
                    console.log(error);
                  else
                      console.log(res.body, "success");
              });
            res.json({
                token : token
            })
        } else {
                res.status(401).json(info);
            }
    })(req, res);
}