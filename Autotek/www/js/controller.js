angular.module('starter.controllers', [])
 
.controller('LoginCtrl', function($scope,$state,$http) {
    $scope.user = {};
 
    $scope.login = function(data) {
    	console.log(data);
        console.log("LOGIN user: " + $scope.user.username + " - PW: " + $scope.user.password);
     	$state.go('main'); 
    }

})