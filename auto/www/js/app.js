// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Autotek', ['ionic','CoreApi','starter.controllers','starter.directives', 'starter.services', '720kb.datepicker', 'LocalStorageModule', 'ionic-timepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

 .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
      templateUrl: "templates/home.html",
      url: "/home",
      controller:'LoginCtrl'
    })

    .state('main',{
      templateUrl:"templates/main.html",
      url:"/main",
      controller:'MainCtrl'
    })
    
    .state('about',{
      templateUrl:"templates/about.html",
      url:"/about"
    })
    
    .state('contact',{
      templateUrl:"templates/contact.html",
      url:"/contact"
    })
    
     .state('services',{
      templateUrl:"templates/services.html",
      url:"/services"
    })
    
    .state('promotion',{
      templateUrl:"templates/promo_service.html",
      url:"/promotions"
    })

    .state('location',{
        templateUrl:"templates/location.html",
        url:"/location",
      })


    .state('booking', {
      templateUrl: "templates/booking.html",
      url: "/booking",
      controller: 'BookingCtrl'
    })

    .state('history', {
      templateUrl: "templates/history.html",
      url: "/history",
      controller: 'HistoryCtrl'
    })

    .state('appointment', {
      templateUrl: "templates/appointment.html",
      url: "/appointment",
      controller: 'AppointmentCtrl'
    })

    .state('bookappointment', {
      templateUrl: "templates/bookappointment.html",
      url: "/bookappointment/:branchid",
      controller: 'BookAppointmentCtrl'
    })

    .state('appointmentreview', {
      templateUrl: "templates/appointment_review.html",
      url: "/appointreview",
      controller: "AppointReviewCtrl"
    })

    $urlRouterProvider.otherwise('/home');
  });