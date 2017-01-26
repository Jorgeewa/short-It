(function (){
    angular.module('shortIt')
        .controller('LoginController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope){
            $scope.logIn = function(){
                console.log($scope.login);
                $http.post('/api/user/login', $scope.login).then(function(success){
                    localStorage.setItem('User-Data', JSON.stringify(success));
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