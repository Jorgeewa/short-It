var Celebrities = require('../datasets/celebrity');

module.exports.render = function(req, res){
    Celebrities.find()
        .exec(function(error, allCelebs){
            if(error)
                console.log(error);
            else{
                res.json(allCelebs)
            }
    })
}