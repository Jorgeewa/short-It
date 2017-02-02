(function (){
    angular.module('shortIt')
        .controller('LoginController', ['$scope', '$http', '$rootScope', '$window',function ($scope, $http, $rootScope, $window){
            $scope.logIn = function(){
                $http.post('/api/user/login', $scope.login).then(function(success){
                    if(success.data.token){
                        data = ($window.atob(success.data.token.split('.')[1]));
                        localStorage.setItem('User-Data', data);
                        $rootScope.$broadcast('loggedIn',{
                                                loggedIn : true,
                                                loggedOut : false

                                            })
                    } else{
                        $scope.error = success.data.message;
                        console.log(success, $scope.error);
                    }
                }).catch(function(error){
                    $scope.error = error.data.message;
                    console.log(error, $scope.error)
                })
            }
        }])
}())