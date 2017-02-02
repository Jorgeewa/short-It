(function (){
    angular.module('shortIt')
        .controller('SignUpController', ['$scope', '$http', '$rootScope', '$window',function($scope, $http, $rootScope, $window){
            $scope.createUser = function(){
                console.log('firing')
                $http.post('api/user/signup', $scope.newUser).then(function(success){
                    console.log(success)
                    if(success.data.token){
                        data = ($window.atob(success.data.token.split('.')[1]));
                        localStorage.setItem('User-Data', data);
                        $rootScope.$broadcast('loggedIn',{
                            loggedIn : true,
                            loggedOut : false

                    })
                    } else{
                            $scope.error = success.data.error; 
                            console.log(success)
                    }
                }).catch(function(error){
                    
                    console.log(error);
                })
            }
        }])
}())