(function(){
    angular.module('shortIt')
        .controller('MainController', ['$scope', '$http', function ($scope, $http){
            if (localStorage['User-Data']){
                console.log(localStorage['User-Data']);
                data = JSON.parse(localStorage['User-Data']);
                console.log(data);
                $scope.userName = data.userName;
                $scope.loggedIn = true;
                $scope.loggedOut = false;
                }
            
            $http.get('/main').then(function(success){
                console.log(success);
                $scope.newsItems = success.data.slice(0,12);
            }).catch(function(error){
                console.log(error);
            })
        }])
}())