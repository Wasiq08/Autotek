angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, $http) {
    $scope.user = {};

    var params = {
        'grant_type': 'password',
        'username': '0557613133',
        'password': '123456',
        'client_id': 'Android02',
        'client_secret': '21B5F798-BE55-42BC-8AA8-0025B903DC3B',
        'scope': 'app1'
    };

    $scope.login = function(data) {
        var url = 'http://autotecauth.azurewebsites.net/identity/connect/token';

        $http.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function(res) {
            console.log(res);
        }).error(function(err) {
            console.log(err);
        })

    }




})

.controller('BookAppointmentCtrl', function($scope, $state, $http) {
    
})


.controller('MapController', function($scope, $ionicLoading) {

    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });

        $scope.map = map;
    });

});
