var Token = require('../datasets/token');
var User = require('../datasets/users');

module.exports.getNodebbUsers = function(req, res){
    console.log(req.body.token);
    Token.find({value : req.body.token}, function(error, user){
        if(!error)
            userId = user.userId;
        
        User.find({_id : userId}, function(error, user){
            if(!error)
                res.json({
                    username : user.userName,
                    email : user.email,
                    id : user._id
                })
        })
    })
    
}