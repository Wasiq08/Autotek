angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, User, localStorageService, $ionicLoading, $ionicPopup, Cities) {
    $scope.user = {};
    //$scope.user.username = '0557613133';
    //$scope.user.password = '123456';

    Cities.getCities();

    var params = {
        'grant_type': 'password',
        //'username': '0557613133',
        'username': $scope.user.username,
        //'password': '123456',
        'password': $scope.user.password,
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

.controller('NotificationCtrl', ['$scope', '$ionicSideMenuDelegate', function($scope, $ionicSideMenuDelegate) {
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

}])

.controller('BookAppointmentCtrl', function($scope, $state, $http, CityBranchId, Appointment, ionicTimePicker, $stateParams, AppointmentDetail) {
    console.log(CityBranchId.get_cityid());
    console.log(CityBranchId.get_branchid());
    var current_date = new Date();
    console.log($stateParams.branchid);
    $scope.dateobj = {};
    $scope.dateobj.date = current_date;
    $scope.hours = 09;
    $scope.minutes = 30;
    $scope.ampm = "AM";
    //console.log(date);
    var getdate = current_date.getDate()
    var month = current_date.getMonth();
    var year = current_date.getFullYear();
    var branchid = $stateParams.branchid;
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
            console.log(val)
            if (typeof(val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTime = new Date(val * 1000);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
                var hh = selectedTime.getUTCHours();
                var h = hh;
                dd = "AM";
                if (h >= 12) {
                    h = hh - 12;
                    dd = "PM";
                }
                if (h == 0) {
                    h = 12;
                }
                $scope.hours = h < 10 ? ("0" + h) : h;
                var mm = selectedTime.getUTCMinutes();
                $scope.minutes = mm < 10 ? ("0" + mm) : mm;
                $scope.ampm = dd;
            }
        },
        inputTime: 50400, //Optional
        format: 12, //Optional
        step: 1, //Optional
        setLabel: 'Set' //Optional
    };
    $scope.openTimePicker = function() {
        ionicTimePicker.openTimePicker(ipObj1);
    }

    $scope.book = function() {
        console.log("scope.date", $scope.dateobj.date)
        $state.go('appointmentreview');
        var date = new Date($scope.dateobj.date);
        AppointmentDetail.set({
            startTime: $scope.hours + ":" + $scope.minutes + " " + $scope.ampm,
            location: CityBranchId.get_branchid().BranchName,
            day: dayname(date.getDay()),
            date: date.getDate(),
            month: monthname(date.getMonth())
        })
    }


})

.controller('MainCtrl', ['$scope', 'localStorageService', function($scope, localStorageService) {
    $scope.user = localStorageService.get("loggedInUser").user;
    console.log(localStorageService.get("loggedInUser"));
}])

.controller('PromotionCtrl', ['$scope', function($scope) {

}])

.controller('SignupCtrl', ['$scope', '$rootScope', '$http', '$ionicPopup', '$state', function($scope, $rootScope, $http, $ionicPopup, $state) {
    $scope.user = {};
    $scope.user.MobileNumber = +966
    $scope.user.User = {};
    $scope.regex = '^[a-zA-Z]+[a-zA-Z0-9._-]+@[a-z]+\.[a-z.]{2,5}$';

    $scope.register = function() {
        console.log($scope.user)

        var errors = [];
        if ($scope.user.FirstName == null || $scope.user.FirstName == "") {
            errors.push({ message: 'Name is required' })
        }

        if ($scope.user.MobileNumber == null || $scope.user.MobileNumber == "") {
            errors.push({ message: 'Number is required' })
        }

        if ($scope.user.EmailAddress == null || $scope.user.EmailAddress == "") {
            errors.push({ message: 'Email is required' });
        } else {
            var email = $scope.user.EmailAddress.match($scope.regex);
            if (email == null) {
                errors.push({ message: 'Not a valid email' });
            }
        }

        if ($scope.user.User.Password == null || $scope.user.User.Password == "") {
            errors.push({ message: 'Password is required' })
        }




        if (errors.length != 0) {
            $scope.deactivate(errors)

        } else {
            var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
            $scope.user.User.UserName = $scope.user.MobileNumber;
            var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
            $ionicLoading.show({
                content: '',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $http.post(url, params, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function(result) {
                    $http.post('http://autotecapi.azurewebsites.net/api/CustomerRegistration', $scope.user, {
                            headers: {
                                'Authorization': "Bearer" + " " + result.access_token
                            }
                        }).success(function(res) {
                            console.log(res);
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success!',
                                template: 'A verication key is sent through SMS!'
                            });

                            alertPopup.then(function(res) {
                                $state.go('home')
                                    //console.log('Thank you for not eating my delicious ice cream cone');
                            });
                        })
                        .error(function(err) {
                            var error = [{ message: err.Message }]
                            $scope.deactivate(error)
                        })
                })
                .error(function(error) {

                })
                //$ionicSlideBoxDelegate.slide(index);

        }
    }

    $scope.deactivate = function(err) {
        $scope.data = {};
        $scope.data.err = err;
        var confirmPopup = $ionicPopup.confirm({
            title: 'We cant sign you up! ',
            templateUrl: 'templates/errorpopup.html',
            scope: $scope
        });

        confirmPopup.then(function(res) {
            if (res) {
                //console.log('You are sure');
            } else {
                //console.log('You are not sure');
            }
        });
    }

}])

.controller('AppointConfimedCtrl', ['$scope', '$ionicHistory', '$state', function($scope, $ionicHistory, $state) {
    $scope.gohome = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go('main');
    }
}])

.controller('HistoryCtrl', ['$scope', 'User', function($scope, User) {
    $scope.history = [];
    var pageNumber = 0;
    var pageSize = 4;

    $scope.noMoreHistory = true;
    $scope.getMoreHistory = function(start) {
        var _start = start || false
        User.getOrderHistory(pageNumber, pageSize).success(function(res) {

                if (_start) {
                    $scope.history = [];
                }
                if (res.length < pageSize) {
                    $scope.noMoreHistory = false;
                }
                for (var i = 0; i < res.length; i++) {
                    var date = new Date(res[i].OrderDate);
                    $scope.history.push({
                        year: date.getFullYear(),
                        date: date.getDate(),
                        month: monthname(date.getMonth()),
                        SalesOrderNumber: res[i].SalesOrderNumber,
                        TotalAmount: res[i].TotalAmount,
                        TotalItems: res[i].TotalItems
                    })

                }
                pageNumber = pageNumber + 1;
                if (_start) {
                    $scope.$broadcast('scroll.refreshComplete');
                    //$scope.$apply()
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }

            })
            .error(function(err) {
                console.log(err);
            })
    }

}])

.controller('AppointmentCtrl', ['$scope', 'Cities', 'Appointment', 'CityBranchId', '$state', 'localStorageService', function($scope, Cities, Appointment, CityBranchId, $state, localStorageService) {
    console.log(Cities.cities)
    var cities = localStorageService.get('cities')
    $scope.cities = {
        selectedOption: { CityId: 1, CityName: "Riyadh" },
        availableOptions: cities
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
        CityBranchId.set_branchid($scope.branches.selectedOption);
        $state.go('app.bookappointment', { branchid: $scope.branches.selectedOption.Id })

        // $scope.cities = Cities.cities;
    }

}])

.controller('BookingCtrl', ['$scope', 'Appointment', '$ionicLoading', function($scope, Appointment, $ionicLoading) {
    $scope.appointments = [];
    var pageNumber = 0;
    var pageSize = 4;

    $scope.noMoreAppointment = true;
    $scope.getMoreAppointment = function(start) {
            console.log("hello")
            var _start = start || false
            Appointment.get(pageNumber, pageSize).success(function(res) {
                    console.log(res)
                    if (_start) {
                        $scope.appointments = [];
                    }
                    if (res.length < pageSize) {
                        $scope.noMoreAppointment = false;
                    }
                    for (var i = 0; i < res.length; i++) {
                        var date = new Date(res[i].AppointmentDate);
                        $scope.appointments.push({ startTime: res[i].StartTimeStr, location: res[i].BranchName, day: dayname(date.getDay()), date: date.getDate(), month: monthname(date.getMonth()) })
                    }
                    pageNumber = pageNumber + 1;
                    if (_start) {
                        $scope.$broadcast('scroll.refreshComplete');
                        //$scope.$apply()
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                })
                .error(function(err) {
                    console.log(err)
                })
        }
        // $scope.getMoreAppointment();
}])

.controller('AppointReviewCtrl', ['$scope', 'AppointmentDetail', function($scope, AppointmentDetail) {
        console.log(AppointmentDetail.get())
        $scope.x = AppointmentDetail.get()
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
