(function(){
    angular.module('shortIt')
        .controller('OpenTradesController',['$scope', '$http', function($scope, $http){
            userData = JSON.parse(localStorage.getItem('User-Data'));
            var errorDisplay = angular.element(document.getElementById("error"));
            console.log('I ran here')
            $http.post('/api/view/open-trades',{userId : userData._id}).then(function(success){
                console.log(success);
                $scope.openTrades = success.data.openTrades;
            }).catch(function(error){
                console.log(error);
            })
            
            $scope.close = function(typeofTrade, celebrity, volume, tradeId, price){
                console.log(celebrity, volume, typeofTrade, userData._id, price)
                $http.post('/api/close', {
                    celebrityName : celebrity,
                    quantity : volume,
                    typeofTrade : typeofTrade,
                    userId : userData._id,
                    tradeId : tradeId,
                    price : price
                })
            }
            
            $scope.displayHandler = function(){
                errorDisplay[0].style.display = "none";
                //successDisplay[0].style.display = "none";
            }
            $scope.displayHandler();
            var tradeDetails, buttonClicked;
            $scope.storeValues = function(values, type){
                tradeDetails = values;
                buttonClicked = type;
                console.log(values);
            }
            
            $scope.checkError = function(){
                convertToInt = parseInt($scope.getPrice);
                if(isNaN($scope.getPrice) || convertToInt<1){
                    $scope.errorMessage = "Price must be positive integer"
                    errorDisplay[0].style.display = "block";
                    return 0;
                }
                $http.post('/api/checkError',{
                    celebrityName : tradeDetails.celebrity
                }).then(function(success){
                    bid = parseFloat(success.data.bid);
                    ask = parseFloat(success.data.ask);
                    console.log(bid, ask, $scope.getPrice > ask);
                    if((tradeDetails.typeofTrade == "buy" && $scope.getPrice > ask && buttonClicked == "takeProfit"
                       || tradeDetails.typeofTrade == "buy" && $scope.getprice < bid && buttonClicked == "stopLoss")||
                      (tradeDetails.typeofTrade == "short" && tradeDetails.price * 2 <= $scope.getPrice && buttonClicked == "takeProfit" ||
                      tradeDetails.typeofTrade == "short" && $scope.getPrice < bid && buttonClicked == "stopLoss")){
                        $http.post('/api/setStops&Takeprofits', {
                            celebrityName : tradeDetails.celebrity,
                            type : buttonClicked,
                            price : $scope.getPrice,
                            userId : userData._id,
                            typofTrade : tradeDetails.typeofTrade,
                            quantity : tradeDetails.volume,
                            tradeId : tradeDetails.tradeId
                            
                        })
                    } else {
                        $scope.errorMessage = "You cannot place stops or take profits in between the spread";
                        errorDisplay[0].style.display = "block";
                    }
                })
            }
        }])
}());
