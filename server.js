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
var session = require('express-session');

var loadCelebrityController = require('./server/controllers/load-celebrity-controller');
var updatePriceController = require('./server/controllers/update-price-controller');
var userController = require('./server/controllers/user-controller');
var renderCelebritiesController = require('./server/controllers/render-celebrities-controller');
var showAccountDetailsController = require('./server/controllers/show-account-details-controller');
var renderCelebrityNews = require('./server/controllers/render-celebrity-news-controller');
var getTopTraders = require('./server/controllers/get-top-traders-controller');
var clientController = require('./server/controllers/client')
var oauth2Controller = require('./server/controllers/oauth2');
var authentication = require('./server/controllers/auth');

mongoose.connect('mongodb://localhost:27017/shortIt');
//mongoose.connect('mongodb://heroku_6j09bfdg:58r3cd70mq1om5cd9hju6fk87r@ds041586.mlab.com:41586/heroku_6j09bfdg');


require('./server/datasets/users');
require('./server/config/passport');

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/app', express.static(__dirname + "/app"));
app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use(session({
    secret : 'super secret session key',
    saveUnintialized : true,
    resave : true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('socket.io', io)

//load Celebrities and get them
app.post('/api/load/celebrity', loadCelebrityController.init);
app.post('/api/price/get', loadCelebrityController.getPrices);

//calculate prices and update them
app.post('/api/compute/price', updatePriceController.computeNewPrice);
app.post('/api/update/price', updatePriceController.updatePrice);
app.post('/api/close', updatePriceController.closeOpenTrade);
app.post('/api/checkError', updatePriceController.checkError);
app.post('/api/setStops&TakeProfits', updatePriceController.setStopsTakeProfits);

//create new users
app.post('/api/user/signup', userController.register);
app.post('/api/user/login', userController.login);

//render all my freaking celebrities
app.get('/api/render/celebrites', renderCelebritiesController.render);

//get open trades
app.post('/api/view/open-trades', showAccountDetailsController.openTrades);
app.post('/api/view/trade-history', showAccountDetailsController.tradeHistory);
app.post('/api/view/account-balance', showAccountDetailsController.accountBalance);

//get the Top Traders
app.get('/api/view/top-trader', getTopTraders.topTraders);

//render news on main page
app.get('/main', renderCelebrityNews.render);

//to work with nodebb
app.post('/api/clients', authentication.isAuthenticated, clientController.postClients);
app.get('/api/oauth2/authorize', authentication.isAuthenticated, oauth2Controller.authorization);
app.post('/api/oauth2/token', authentication.isClientAuthenticated, oauth2Controller.token);
app.post('/api/oauth2/users', oauth2Controller.getNodebbUsers);
app.post('/api/test', authentication.isAuthenticated, oauth2Controller.testing);

app.get('/', function(req, res){
   res.sendfile('index.html'); 
});