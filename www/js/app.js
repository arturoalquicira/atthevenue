//Define angular.module with dependencies: firebase, ngRoute, ui.bootstrap
var atthevenue = angular.module('atthevenue',['firebase','ngRoute', 'ui.bootstrap', 'ngFitText']);

atthevenue.config(["$routeProvider", function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: '/views/landing.html',
            controller: 'landingCtrl'
        })
        .when('/signup',{
            templateUrl: '/views/signup.html',
            controller: 'signupCtrl'
        })
        .when('/login',{
            templateUrl: '/views/login.html',
            controller: 'loginCtrl'
        })
}]);

atthevenue.controller('landingCtrl',[
    "$scope",
    "$firebase",
    function($scope, $firebase){

    }
]);

atthevenue.controller('loginCtrl',[
    "$scope",
    "$firebase",
    function($scope, $firebase){

    }
]);

atthevenue.controller('signupCtrl', [
    "$scope",
    "$firebase",
    function($scope, $firebase){

    }
]);
