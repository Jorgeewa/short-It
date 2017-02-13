var mongoose = require('mongoose');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = mongoose.model('User');
var Client = require('../datasets/client');
var Client = mongoose.model('Client');

passport.use('check-basic', new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { 
          console.log(err)
          return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      if(!user.validPassword(password)) {

            return callback(err);
      }
        // Success
        return callback(null, user);
    });
  }
));

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ id: username }, function (err, client) {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));


passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({value: accessToken }, function (err, token) {
      if (err) { return callback(err); }

      // No token found
      if (!token) { return callback(null, false); }

      User.findOne({ _id: token.userId }, function (err, user) {
        if (err) { return callback(err); }

        // No user found
        if (!user) { return callback(null, false); }

        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });
    });
  }
));


exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isAuthenticated = passport.authenticate(['check-basic', 'bearer'], { session : false });