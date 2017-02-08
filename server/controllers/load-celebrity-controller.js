var Celebrity = require('../datasets/celebrity');

module.exports.init = function(req, res){
    var celebrity = new Celebrity(req.body);
    celebrity.save();
    
    res.json(req.body);
}

module.exports.getPrices = function(req, res){
    console.log(req.body)
    Celebrity.find(req.body, function(error, results){
        if(error){
            console.log(error);
        } else{
            var celebrity = results[0];
            console.log(celebrity)
            res.json({
                celebrity : celebrity
            })
        }
        
    })
}