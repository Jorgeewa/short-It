(function(){
    angular.module('shortIt')
        .controller('TradeHistoryController', ['$scope', '$http', function($scope, $http){
            userData = JSON.parse(localStorage.getItem('User-Data'));
            $http.post('/api/view/trade-history', {userId : userData.data._id}).then(function(success){
                $scope.trades = success.data.user.history;
            }).catch(function(error){
                console.log(error);
            })
        }])
}());