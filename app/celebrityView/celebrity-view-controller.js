(function () {
    angular.module('shortIt')
        .controller('CelebrityViewController', ['$scope', '$http', 'socket', '$window', function ($scope, $http, socket, $window) {
            var bidDisplay = angular.element(document.querySelector(".bid"));
            var askDisplay = angular.element(document.querySelector(".ask"));
            var bidColorChange = angular.element(document.querySelector(".bidColorChange"));
            var askColorChange = angular.element(document.querySelector(".askColorChange"));
            var timerId;
            if (localStorage['User-Data'] !== undefined){
                $scope.user = JSON.parse(localStorage['User-Data']);
                console.log($scope.user);
                console.log($scope.user.data._id)
            }
            var simulatePrice = function(bid, timerId){
                bidSimulate = bid;
                console.log(timerId);
                if(timerId)
                    clearInterval(timerId);
                timerId = setInterval(function () {
                            bidSimulate = parseFloat(bid);
                            randNumber = Math.random() * 10;
                            randNumberModulus = randNumber % 6;
                            randNumberFloor = Math.floor(randNumberModulus);
                            bidSimulate = bidSimulate + (0.01 * randNumberFloor);
                            askSimulate = bidSimulate + 2.02;
                            bidDisplay.html("N" + bidSimulate.toFixed(2) + "<br>" + "Bid");
                            askDisplay.html("N" + askSimulate.toFixed(2) + "<br>" + "Ask");
                            setInterval(function () {
                                bidColorChange[0].style.backgroundColor = "green";
                                askColorChange[0].style.backgroundColor = "green";
                            }, 1000);
                            setInterval(function () {
                                bidColorChange[0].style.backgroundColor = "red";
                                askColorChange[0].style.backgroundColor = "blue";
                            }, 1500);

                        }, 3000);
                return timerId;

            }
            
            $http.post('/api/price/get', {celebrityName : $window.celebrityName}).then(function(success){
                console.log(success.data);
                var bid, ask;
                bid = success.data.bid;
                ask = success.data.ask
                console.log(typeof(bid), bid , "this is the bid type");
                bidDisplay.html("N" + bid.toFixed(2) + "<br>" + "Bid");
                askDisplay.html("N" + ask.toFixed(2) + "<br>" + "Ask");
                timerId = simulatePrice(bid, false);
                console.log(timerId);
                }).catch(function(error){
                    console.log("I ran here")
                    console.log(error);
            });
            
            $scope.computeNewPrice = function(){
                console.log("firing");
                $http.post('/api/compute/price', {
                    celebrityName : $window.celebrityName,
                    quantity: $scope.getQuantity,
                    typeofTrade : $scope.parameters.type,
                    userId : $scope.user.data._id
                }).then(function(success){
                    console.log(success);
                    if(success.data.price)
                        $scope.indicativePrice = success.data.price.toFixed(2);
                    else{
                        console.log(success.data.error);
                    }
                }).catch(function(error){
                    console.log(error)
                })
            }
            
            $scope.updatePrices = function(){
                console.log($scope.indicativePrice);
                $http.post('/api/update/price', {
                    celebrityName : $window.celebrityName,
                    quantity: $scope.getQuantity,
                    typeofTrade : $scope.parameters.type,
                    price : $scope.indicativePrice,
                    userId : $scope.user.data._id
                }).then(function(success){
                    console.log(success)
                    bid = success.data.bid;
                    timerId = simulatePrice(bid, timerId);
                }).catch(function(error){
                    console.log(error);
                })
            }
            
            $scope.celebrityName = $window.celebrityName;
            
            socket.on('priceShock', function(data){
                console.log(data);
                bid = data.bid;
                timerId = simulatePrice(bid, timerId);
            })
    }]);
    
}());