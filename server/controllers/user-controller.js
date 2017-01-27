var User = require('../datasets/users');

module.exports.register = function(req, res){
    var num = 100000;
    var user = new User(req.body);
    console.log(user);
    user.accountValueInit = 100000;
    user.accountValue =user.accountValueInit;
    console.log(user.accountValueInit);
    user.save();
    res.json(req.body);
}

module.exports.login = function(req, res){
    User.find(req.body, function(error, results){
        if(error){
            console.log("error")
        } else {
            if(results && results.length ===1){
                var userData = results[0];
                res.json({
                    email : req.body.email,
                    _id : userData._id,
                    nickname : userData.nickname
                })
            }
        }
    })
}