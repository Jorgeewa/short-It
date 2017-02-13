(function(){
    angular.module('shortIt')
        .controller('MainController', ['$scope', '$http', function ($scope, $http){
            if (localStorage['User-Data']){
                console.log(localStorage['User-Data']);
                data = JSON.parse(localStorage['User-Data']);
                console.log(data);
                $scope.userName = data.userName;
                $scope.loggedIn = true;
                $scope.loggedOut = false;
                }
            
            $http.get('/main').then(function(success){
                console.log(success);
                $scope.newsItems = success.data.slice(0,12);
            }).catch(function(error){
                console.log(error);
            })
            /*$http.post('/api/clients',{name : "create-and-login-user",
                                      id : 'nodeBB_logIn',
                                       secret: 'change_this_later'
                                      
                                      }).then(function(success){
                console.log('george');
            });*/
            
            $scope.openTab = function(activate){
                var mostActive = angular.element(document.querySelector(".most-active"))[0];
                var mostAdvanced = angular.element(document.querySelector(".most-advanced"))[0];
                var mostDeclined = angular.element(document.querySelector(".most-declined"))[0];
                var unusualVolume = angular.element(document.querySelector(".unusual-volume"))[0];
                    switch(activate){
                        case 1:
                            $scope.activeTabOne = true;
                            $scope.activeTabTwo = false;
                            $scope.activeTabThree = false;
                            $scope.activeTabFour = false;
                            console.log(mostActive[0])
                            mostActive.style.display = "block";
                            mostAdvanced.style.display = "none";
                            mostDeclined.style.display = "none";
                            unusualVolume.style.display = "none";
                        break;
                        case 2:
                            $scope.activeTabTwo = true;
                            $scope.activeTabOne = false;
                            $scope.activeTabThree = false;
                            $scope.activeTabFour = false;
                            mostActive.style.display = "none";
                            mostAdvanced.style.display = "block";
                            mostDeclined.style.display = "none";
                            unusualVolume.style.display = "none";
                        break;
                        case 3:
                            $scope.activeTabTwo = false;
                            $scope.activeTabOne = false;
                            $scope.activeTabThree = true;
                            $scope.activeTabFour = false;
                            mostActive.style.display = "none";
                            mostAdvanced.style.display = "none";
                            mostDeclined.style.display = "block";
                            unusualVolume.style.display = "none";
                        break;
                        case 4:
                            $scope.activeTabTwo = false;
                            $scope.activeTabOne = false;
                            $scope.activeTabThree = false;
                            $scope.activeTabFour = true;
                            mostActive.style.display = "none";
                            mostAdvanced.style.display = "none";
                            mostDeclined.style.display = "none";
                            unusualVolume.style.display = "block";
                        break;
                    }
                }
        }])
}())