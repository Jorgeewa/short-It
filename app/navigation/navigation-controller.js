(function(){
    angular.module('shortIt')
        .controller('NavigationController', ['$scope', '$http', '$rootScope', '$state', '$window' , function($scope, $http, $rootScope, $state, $window){
            if (localStorage['User-Data']){
                console.log("Working")
                console.log(localStorage['User-Data']);
                data = JSON.parse(localStorage['User-Data']);
                console.log(data);
                $scope.userName = data.userName;
                $scope.loggedIn = true;
                $scope.loggedOut = false;
                $state.go('main');
                } else {
                    $scope.loggedIn = false;
                    $scope.loggedOut = true;
                    $state.go('main');
                }
            
            $scope.$on('loggedIn', function(event, arg){
                                                $scope.loggedOut = arg.loggedOut;
                                                $scope.loggedIn = arg.loggedIn;
                                                data = JSON.parse(localStorage['User-Data']);
                                                console.log(data);
                                                $scope.userName = data.userName;
                                                $state.go('main'); 
                                             })
            
            $scope.logOut = function(){
                $scope.loggedOut = true;
                $scope.loggedIn = false;
                localStorage.clear();
            }
            
            $http.get('/api/render/celebrites', {do : "nothing"}).then(function(success){
                console.log(success.data.length);
                $scope.celebrities = success.data;
                $scope.length = success.data.length;

            }).catch(function(error){
                console.log(error);
            })
            
            $scope.exec = function(){
                var ticker = new $window.$ticker("tickerUl","#tickerDiv-child", 3, $scope.length);
                ticker.$move();
            }
            
            $scope.celebrityName = function(celebrity){
                $window.celebrityName = celebrity;
            }
            
            $scope.checkIfLoggedIn = function(direction){
                console.log(localStorage['User-Data'])
                if(!localStorage['User-Data']){
                    $state.go('logIn')
                } else if(direction == 'viewPortofolio') {
                    $state.go('openTrades');
                } else {
                    $state.go('tradeHistory');
                }
            }
            
        }])
}())