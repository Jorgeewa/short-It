(function(){
    angular.module('shortIt')
        .controller('RenderCelebritiesController', ['$scope', '$http', '$window', function($scope, $http, $window){
            $http.get('/api/render/celebrites', {do : "nothing"}).then(function(success){
                console.log(success.data);
                $scope.celebrities = success.data;
            }).catch(function(error){
                console.log(error);
            })
            
            $scope.celebrityName = function(celebrity){
                $scope.$broadcast('celebrityName',{name : celebrity});
                $window.celebrityName = celebrity
                console.log("I worked", celebrity)
            }
        }])
}());