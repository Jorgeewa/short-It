var oauth2orize = require('oauth2orize')
var mongoose = require('mongoose');
var User = require('../datasets/users');
var Client = require('../datasets/client');
var Client = mongoose.model('Client');
var Token = require('../datasets/token');
var Code = require('../datasets/code');

var server = oauth2orize.createServer();

server.serializeClient(function(client, callback) {
    console.log("I ran herec")
  return callback(null, client._id);
});

// Register deserialization function
server.deserializeClient(function(id, callback) {
    console.log("I ran hered")
  Client.findOne({ _id: id }, function (err, client) {
    if (err) { return callback(err); }
    return callback(null, client);
  });
});


// Register authorization code grant type
server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
  // Create a new authorization code
  var code = new Code({
    value: uid(16),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: user._id
  });

  // Save the auth code and check for errors
  code.save(function(err) {
    if (err) { return callback(err); }

    callback(null, code.value);
  });
}));


// Exchange authorization codes for access tokens
server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
    console.log(client, code, redirectUri)
  Code.findOne({ value: code }, function (err, authCode) {
    if (err) { return callback(err); }
      console.log(authCode.clientId,client._id);
    if (authCode === undefined) { return callback(null, false); }
    if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
    //if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

    // Delete auth code now that it has been used
    authCode.remove(function (err) {
      if(err) { return callback(err); }

      // Create a new access token
      var token = new Token({
        value: uid(256),
        clientId: authCode.clientId,
        userId: authCode.userId
      });

      // Save the access token and check for errors
      token.save(function (err) {
        if (err) { return callback(err); }

        callback(null, token);
      });
    });
  });
}));


// User authorization endpoint
/*module.exports.authorization = [
  server.authorization(function(clientId, redirectUri, callback) {
      console.log(clientId);
    Client.findOne({ id: clientId }, function (err, client) {
      if (err) { console.log("I ran herea");return callback(err); }

      return callback(null, client, redirectUri);
    });
  }),
  function(req, res){
      console.log("I ran hereb")
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
]*/

setCodes = function(client, user, redirectUri, Code){
    console.log('starting...')
    var code = new Code();
        code.value = uid(16),
        code.clientId = client.id,
        code.userId = user._id
    code.save(function(error, success){
        if(!success){
            console.log(Code.find({}), 'I ran hered', code, error);
        }
    });
    //console.log(code);
    //Code.find({}, function(error, success){if(success){console.log(success, "george")}});
}


module.exports.authorization = [
    server.authorization(function(clientId, redirectUri, callback) {
        Client.findOne({ id: clientId }, function (err, client) {
          if (err) { console.log("I ran herea");return callback(err); }
          return callback(null, client, redirectUri);
        });
      }, function (client, user, redirectUri, done) {
        console.log(redirectUri);
        setCodes(client, user, redirectUri, Code);
        /*var code = new Code({
            value: uid(16),
            clientId: client.id,
            redirectUri: redirectUri,
            userId: user._id
        });*/
        Code.find({
            clientId: client.id,
            userId: user._id
        }, function (err, codes) {
            console.log(codes);
            if (err) { console.log("second"); return done(err); }
            if (codes.length > 0) {
                console.log("third")
                return done(null, true);
            } else {
                console.log('I ran here fourth');
                return done(null,false);
            }
        });
    })
]

// Application client token exchange endpoint
module.exports.token = [
  server.token(),
  server.errorHandler()
]



module.exports.getNodebbUsers = function(req, res){
    console.log(req.body.token);
    Token.find({value : req.body.token}, function(error, user){
        userId = user[0].userId;
        if(!error){
            User.find({_id : userId}, function(error, user){
                console.log(userId);
                if(!error){
                    res.json({
                        username : user[0].userName,
                        email : user[0].email,
                        id : user[0]._id
                    })
                } else {
                    console.log(error);
                }
            })
        }
    })
    
}



function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.testing = function(req, res){
    console.log(req)
    res.json({user: req.body, name: 'george'})
}
