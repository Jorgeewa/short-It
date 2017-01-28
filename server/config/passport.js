var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField : 'email'
},
    function(userName, password, done){
    User.findOne({email : userName}, function(error, user){
        if(error){
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