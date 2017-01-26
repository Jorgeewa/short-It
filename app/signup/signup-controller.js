(function (){
    angular.module('shortIt')
        .controller('SignUpController', ['$scope', '$http', function($scope, $http){
            $scope.createUser = function(){
                console.log($scope.newUser);
                $http.post('api/user/signup', $scope.newUser).then(function(success){
                    console.log(success);
                }).catch(function(error){
                    console.log(error);
                })
            }
        }])
}())