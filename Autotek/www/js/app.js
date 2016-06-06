// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Autotek', ['ionic','starter.controllers'])

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
      controller:'LoginCtrl'
    })
    
    .state('about',{
      templateUrl:"templates/about.html",
      url:"/about"
    })
    
    .state('contact',{
      templateUrl:"templates/contact.html",
      url:"/contact"
    })


    $urlRouterProvider.otherwise('/home');
  });