(function () {
    angular.module('shortIt', ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider){
        
        $stateProvider
            .state('loadCelebrity', {
            url : "/loadcelebrity",
            templateUrl : "app/admin/load-celebrity.html",
            controller : "LoadCelebrityController"
        })
        
        $stateProvider
            .state('celebrityView', {
            url : "/celebstock",
            templateUrl : "app/celebrityView/celebrity-view.html",
            controller : "CelebrityViewController"
        })
        
        $stateProvider
            .state('signUp', {
            url : "/signup",
            templateUrl : "app/signup/signup.html",
            controller : "SignUpController"
        })
        
        $stateProvider 
            .state('logIn', {
            url : "/login",
            templateUrl : "app/login/login.html",
            controller : "LoginController"
        })
        
        $stateProvider
            .state('main',{
            url : "/",
            templateUrl : "app/main/main.html",
            controller : "MainController"
        })
        
        $stateProvider
            .state('renderCelebrites', {
            url : "/celebrities",
            templateUrl : "app/renderCelebrities/render-celebrities.html",
            controller : "RenderCelebritiesController"
        })
        
        $stateProvider
            .state('openTrades', {
            url : "/open-trades",
            templateUrl : "app/account-view/open-trades/open-trades.html",
            controller : "OpenTradesController"
        })
        
        $stateProvider
            .state('tradeHistory', {
            url : "/trade-history",
            templateUrl : "app/account-view/trade-history/trade-history.html",
            controller : "TradeHistoryController"
        })
        
        $stateProvider
            .state('accountBalance', {
            url : "/account-balance",
            templateUrl : "app/account-view/account-balance/account-balance.html",
            controller : "AccountBalanceController"
        })
        
        $stateProvider
            .state('celebNews', {
            url: "/celebrity-news",
            templateUrl : "app/news/celebrity-news.html",
            controller : "CelebrityNewsController"
        })
    })
    
    //.service('$ticker', $ticker)
    .factory('socket', function ($rootScope) {
      var socket = io.connect('http://localhost:3000/#/celebstock');
      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          })
        }
      };
    })
}());