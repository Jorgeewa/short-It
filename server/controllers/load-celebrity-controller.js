var Celebrity = require('../datasets/celebrity');

module.exports.init = function(req, res){
    var celebrity = new Celebrity(req.body);
    console.log(celebrity);
    console.log(req.body);
    celebrity.save();
    
    res.json(req.body);
}

module.exports.getPrices = function(req, res){
    console.log(req.body)
    Celebrity.find(req.body, function(error, results){
        if(error){
            console.log(error);
        } else{
            var price = results[0];
            res.json({
                bid : price.bid,
                ask : price.ask
            })
        }
        
    })
}