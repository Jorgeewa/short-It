(function(){
    angular.module('shortIt')
        .controller('LoadCelebrityController', ['$scope', '$state', '$http', 
                                        function($scope, $state, $http){
            
            $scope.createCelebrity = function(){
                $http.post('/api/load/celebrity', $scope.celebrity).then(function(success){
                    console.log(success);
                    console.log($scope.celebrity);
                }).catch(function(error){
                    console.log(error);
                })
            }
        }]);
}());