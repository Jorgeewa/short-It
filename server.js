var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var passport = require('passport');

server.listen(3000, function(){
    console.log("listening at port 3000");
});

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var moment = require('moment');//potential problem with moment
var request = require('request');
var cheerio = require('cheerio');


var loadCelebrityController = require('./server/controllers/load-celebrity-controller');
var updatePriceController = require('./server/controllers/update-price-controller');
var userController = require('./server/controllers/user-controller');
var renderCelebritiesController = require('./server/controllers/render-celebrities-controller');
var showAccountDetailsController = require('./server/controllers/show-account-details-controller');
var renderCelebrityNews = require('./server/controllers/render-celebrity-news-controller');

mongoose.connect('mongodb://localhost:27017/shortIt');

require('./server/datasets/users');
require('./server/config/passport');

app.use(passport.initialize());
app.use(bodyParser.json());
app.use('/app', express.static(__dirname + "/app"));
app.use('/node_modules', express.static(__dirname + "/node_modules"));

app.set('socket.io', io)

//load Celebrities and get them
app.post('/api/load/celebrity', loadCelebrityController.init);
app.post('/api/price/get', loadCelebrityController.getPrices);

//calculate prices and update them
app.post('/api/compute/price', updatePriceController.computeNewPrice);
app.post('/api/update/price', updatePriceController.updatePrice);

//create new users
app.post('/api/user/signup', userController.register);
app.post('/api/user/login', userController.login);

//render all my freaking celebrities
app.get('/api/render/celebrites', renderCelebritiesController.render);

//get open trades
app.post('/api/view/open-trades', showAccountDetailsController.openTrades);
app.post('/api/view/trade-history', showAccountDetailsController.tradeHistory);

//render news on main page
app.get('/main', renderCelebrityNews.render);

app.get('/', function(req, res){
   res.sendfile('index.html'); 
});