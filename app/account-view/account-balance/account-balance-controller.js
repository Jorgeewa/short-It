(function(){
    angular.module('shortIt')
        .controller('AccountBalanceController', ['$scope', '$http', function($scope, $http){
            userData = JSON.parse(localStorage.getItem('User-Data'));
            $http.post('/api/view/account-balance', {userId : userData._id}).then(function(success){
                $scope.accountBalance = success.data.user.accountValue;
                $scope.date = new Date("2015-03-25");
            }).catch(function(error){
                console.log(error);
            })
        }])
}());