(function (){
    angular.module('shortIt')
        .controller('SignUpController', ['$scope', '$http', '$rootScope', '$window',function($scope, $http, $rootScope, $window){
            $scope.createUser = function(){
                $http.post('api/user/signup', $scope.newUser).then(function(success){
                    data = ($window.atob(success.data.token.split('.')[1]));
                    localStorage.setItem('User-Data', data);
                    $rootScope.$broadcast('loggedIn',{
                        loggedIn : true,
                        loggedOut : false
                    })
                }).catch(function(error){
                    console.log(error);
                })
            }
        }])
}())