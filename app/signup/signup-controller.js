(function (){
    angular.module('shortIt')
        .controller('SignUpController', ['$scope', '$http', '$rootScope', '$window',function($scope, $http, $rootScope, $window){
            var forum_url = 'http://127.0.0.1:4567/api/config';
            var Forum = {};
            $http.get(forum_url).then(function(res) { 
                Forum.csrf_token = res.data.csrf_token; 
                console.log(Forum.csrf_token);
            
            }).catch(function(error){
                console.log(error);
            });
            
            $scope.createUser = function(){
                console.log('firing')
                $http.post('api/user/signup', {
                    newUser : $scope.newUser,
                    csrf : Forum.csrf_token
                }).then(function(success){
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