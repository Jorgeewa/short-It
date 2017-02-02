(function(){
    angular.module('shortIt')
        .controller('OpenTradesController',['$scope', '$http', function($scope, $http){
            userData = JSON.parse(localStorage.getItem('User-Data'));
            console.log(userData, userData._id);
            var errorDisplay = angular.element(document.getElementById("error"));
            $http.post('/api/view/open-trades',{userId : userData._id}).then(function(success){
                $scope.openTrades = success.data.user.openTrades; 
            }).catch(function(error){
                console.log(error);
            })
            
            $scope.close = function(typeofTrade, celebrity, volume, tradeId){
                console.log(celebrity, volume, typeofTrade, userData._id)
                $http.post('/api/close', {
                    celebrityName : celebrity,
                    quantity : volume,
                    typeofTrade : typeofTrade,
                    userId : userData._id,
                    tradeId : tradeId
                })
            }
            
            $scope.displayHandler = function(){
                errorDisplay[0].style.display = "none";
                successDisplay[0].style.display = "none";
            }
            $scope.displayHandler();
            
            $scope.checkError = function(celebrity, volume, typeofTrade){
                convertToInt = parseInt($scope.getQuantity);
                if(isNaN($scope.getPrice) || convertToInt<1){
                    $scope.errorMessage = "Price must be positive integer"
                    errorDisplay[0].style.display = "block";
                    return 0;
                }
                $http.post('/api/checkError',{
                    celebrityName : celebrity
                }).then(function(success){
                    bid = parseFloat(success.data.bid);
                    ask = parseFloat(success.data.ask);
                    if($scope.getPrice > ask && $scope.parameter.type == 'takeProfits' || $scope.getPrice < bid && $scope.parameter.type == 'stopLoss'){
                        $http.post('/api/setStops&Takeprofits', {
                            celebrityName : celebrity,
                            type : $scope.parameter.type,
                            price : $scope.getPrice,
                            userId : userData._id,
                            typofTrade : typeofTrade,
                            quantity : quantity
                            
                        })
                    } else {
                        $scope.errorMessage = "You cannot place stops or take profits in between the spread";
                        errorDisplay[0].style.display = "block";
                    }
                })
            }
        }])
}());
