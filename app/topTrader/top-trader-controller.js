(function(){
    angular.module('shortIt')
        .controller('TopTraderController', ['$scope', '$http', function($scope, $http){
            $http.get('/api/view/top-trader', {users : 'getMeTheTopGuys'}).then(function(success){
                console.log(success);
                var getTopTraders = function(topTraders, number){
                    sorted = topTraders.sort(function(a, b){return b.returns - a.returns});
                    if(number > sorted.length)
                        return sorted.slice(0, number);
                    else
                        return sorted;
                }
                console.log(getTopTraders(success.data.topTraders, 20));
                $scope.topTraders = getTopTraders(success.data.topTraders, 20);
            }).catch(function(error){
                console.log(errror);
            })
        }])    
    
    
    
}())