//Define angular.module with dependencies: firebase, ngRoute, ui.bootstrap
var atthevenue = angular.module('atthevenue',['firebase','ngRoute', 'ui.bootstrap']);

atthevenue.config(["$routeProvider", function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: 'views/landing.html',
            controller: 'landingCtrl'
        })
}]);

atthevenue.controller('landingCtrl',[
    "$scope",
    "$firebase",
    function($scope, $firebase){

    }
]);

