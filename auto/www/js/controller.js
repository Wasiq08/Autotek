angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, User, localStorageService, $ionicLoading, $ionicPopup, Cities) {
    $scope.user = {};

    Cities.getCities();

    var params = {
        'grant_type': 'password',
        'username': '0557613133',
        'password': '123456',
        'client_id': 'Android02',
        'client_secret': '21B5F798-BE55-42BC-8AA8-0025B903DC3B',
        'scope': 'app1'
    };

    //var params = "grant_type=password&username=0557613133&password=123456&client_id=Android02&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1"

    $scope.login = function(data) {
        localStorageService.remove("access_token");
        $ionicLoading.show({
            content: '',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        User.login(params).success(function(res) {
                //console.log(res);

                if (localStorageService.isSupported) {
                    localStorageService.set("access_token", res.access_token);
                    User.getUser().success(function(res) {
                            //console.log(res)
                            $ionicLoading.hide();
                            loggedInUser = { user: res }
                            localStorageService.set("loggedInUser", loggedInUser);
                            $state.go('main');
                        })
                        .error(function(err) {
                            console.log(err);
                        })
                        //
                }
            })
            .error(function(err) {
                //console.log(err);
                $ionicLoading.hide();
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Error',
                    template: 'Invalid Username/Password!'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        //console.log('You are sure');
                    } else {
                        //console.log('You are not sure');
                    }
                });
            })
    }




})

.controller('BookAppointmentCtrl', function($scope, $state, $http, CityBranchId, Appointment, ionicTimePicker) {
    console.log(CityBranchId.get_cityid());
    console.log(CityBranchId.get_branchid());
    var current_date = new Date();
    //console.log(date);
    var getdate = current_date.getDate()
    var month = current_date.getMonth();
    var year = current_date.getFullYear();
    var branchid = CityBranchId.get_branchid();
    Appointment.getAvailableDays(branchid, year, month + 1).success(function(res) {
            console.log(res);
            Appointment.getAvailableSlots(branchid, year, month + 1, getdate).success(function(result) {
                    console.log(result)
                })
                .error(function(error) {
                    console.log(error)
                })
        })
        .error(function(err) {
            console.log(err)
        })

    var ipObj1 = {
        callback: function(val) { //Mandatory
            if (typeof(val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTime = new Date(val * 1000);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
            }
        },
        inputTime: 50400, //Optional
        format: 12, //Optional
        step: 15, //Optional
        setLabel: 'Set2' //Optional
    };

    ionicTimePicker.openTimePicker(ipObj1);

})

.controller('MainCtrl', ['$scope', 'localStorageService', function($scope, localStorageService) {
    $scope.user = localStorageService.get("loggedInUser").user;
    console.log(localStorageService.get("loggedInUser"));
}])

.controller('AppointmentCtrl', ['$scope', 'Cities', 'Appointment', 'CityBranchId', '$state', function($scope, Cities, Appointment, CityBranchId, $state) {
    console.log(Cities.cities)
    $scope.cities = {
        selectedOption: { CityId: 1, CityName: "Riyadh" },
        availableOptions: Cities.cities
    }
    $scope.branches = {};

    Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
            console.log(res);
            $scope.branches = {
                selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                availableOptions: res
            };
        })
        .error(function(err) {
            console.log(err);
        })


    $scope.hasChanged = function() {
        console.log($scope.cities.selectedOption)
        Appointment.getBranches($scope.cities.selectedOption.CityId).success(function(res) {
                console.log(res);
                $scope.branches = {
                    selectedOption: { Id: res[0].Id, BranchName: res[0].BranchName },
                    availableOptions: res
                };
            })
            .error(function(err) {
                console.log(err);
            })
    }

    $scope.next = function() {
        CityBranchId.set_cityid($scope.cities.selectedOption.CityId);
        CityBranchId.set_branchid($scope.branches.selectedOption.Id);
        $state.go('bookappointment')

        // $scope.cities = Cities.cities;
    }

}])

.controller('BookingCtrl', ['$scope', 'Appointment', '$ionicLoading', function($scope, Appointment, $ionicLoading) {
        $scope.appointments = [];
        $ionicLoading.show({
            content: '',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        Appointment.get().success(function(res) {
                console.log(res)
                var date = new Date(res[0].AppointmentDate);
                console.log(dayname(date.getDay()))
                for (var i = 0; i < res.length; i++) {
                    var date = new Date(res[i].AppointmentDate);
                    $scope.appointments.push({ startTime: res[i].StartTimeStr, location: res[i].BranchName, day: dayname(date.getDay()), date: date.getDate(), month: monthname(date.getMonth()) })
                }

                console.log($scope.appointments)
                $ionicLoading.hide()
            })
            .error(function(err) {
                console.log(err)
            })
    }])
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


function dayname(day) {
    if (day == 0) {
        return 'Sunday';
    } else if (day == 1) {
        return 'Monday'
    } else if (day == 2) {
        return 'Tuesday'
    } else if (day == 3) {
        return 'Wednesday'
    } else if (day == 4) {
        return 'Thursday'
    } else if (day == 5) {
        return 'Friday'
    } else if (day == 6) {
        return 'Saturday'
    }
}

function monthname(month) {
    if (month == 0) {
        return 'January';
    } else if (month == 1) {
        return 'February';
    } else if (month == 2) {
        return 'March';
    } else if (month == 3) {
        return 'April';
    } else if (month == 4) {
        return 'May';
    } else if (month == 5) {
        return 'June';
    } else if (month == 6) {
        return 'July';
    } else if (month == 7) {
        return 'August';
    } else if (month == 8) {
        return 'September';
    } else if (month == 9) {
        return 'October';
    } else if (month == 10) {
        return 'November';
    } else if (month == 11) {
        return 'December';
    }
}
