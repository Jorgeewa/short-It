(function (){
    angular.module('shortIt')
        .controller('LoginController', ['$scope', '$http', '$rootScope', '$window',function ($scope, $http, $rootScope, $window){
            $scope.logIn = function(){
                $http.post('/api/user/login', $scope.login).then(function(success){
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