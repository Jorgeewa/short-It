var mongoose = require('mongoose');
var Client = require('../datasets/client')
var Client = mongoose.model('Client');

module.exports.postClients = function(req, res){
            console.log(req.body);
            console.log("george", req.body.george)
            var client = new Client();
            client.name = req.body.name;
            client.id = req.body.id;
            client.secret = req.body.secret;

            client.save(function(error){
                if(error)
                    console.log(error)
                console.log(req.body.name, "george", req.body.id, client.id)
                res.json({messase: "success",
                         user : req.user._id,
                          client : client.id
                         });
            })

}

module.exports.getClients = function(req, res){
    Client.find({userId : req.user._id}, function(error, clients){
        if(error)
            console.log(error)
        
        res.json(clients)
    })
}