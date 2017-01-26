(function(){
    angular.module('shortIt')
        .controller('OpenTradesController',['$scope', '$http', function($scope, $http){
            userData = JSON.parse(localStorage.getItem('User-Data'));
            console.log(userData, userData.data._id);
            $http.post('/api/view/open-trades',{userId : userData.data._id}).then(function(success){
                $scope.openTrades = success.data.user.openTrades; 
            }).catch(function(error){
                console.log(error);
            })
        }])
}());