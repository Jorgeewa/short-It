(function (){
    angular.module('shortIt')
        .controller('LoginController', ['$scope', '$http', '$rootScope', '$window',function ($scope, $http, $rootScope, $window){
            var forum_url = 'http://127.0.0.1:4567/api/config';
            var Forum = {};
            $http.get(forum_url).then(function(res) { 
                Forum.csrf_token = res.data.csrf_token; 
                console.log(Forum.csrf_token);
            
            }).catch(function(error){
                console.log(error);
            });
            
            $scope.logIn = function(){
                $http.post('/api/user/login', $scope.login, {
                    headers : { 'x-csrf-token': Forum.csrf_token }
                }).then(function(success){
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