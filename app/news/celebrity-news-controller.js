(function(){
    angular.module('shortIt')
        .controller('CelebrityNewsController', ['$scope', '$http', function ($scope, $http){            
            $http.get('/main').then(function(success){
                console.log(success);
                $scope.newsItems = success.data.slice(0,12);
            }).catch(function(error){
                console.log(error);
            })
        }])
}())