//Define angular.module with dependencies: firebase, ngRoute, ui.bootstrap
var qsheets = angular.module('qsheets',['firebase','ngRoute', 'ui.bootstrap', 'ngFitText']);

qsheets.config(["$routeProvider", function($routeProvider){
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
        .when('/profile',{
            templateUrl: '/views/profile.html',
            controller: 'profileCtrl'
        })
        .when('/project', {
            templateUrl: '/views/project.html',
            controller: 'projectCtrl'
        })
}]);

qsheets.controller('landingCtrl',[
    "$scope",
    "$firebase",
    "$firebaseAuth",
    function($scope, $firebaseAuth){

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");
        $scope.authObj = $firebaseAuth(ref);


        // Check authentication state
        var authData = ref.getAuth();
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            console.log("User is logged out");
        }

    }
]);

qsheets.controller('loginCtrl',[
    "$scope",
    "$firebase",
    "$firebaseAuth",
    "$location",
    "Auth",
    function($scope, $firebaseAuth, $location, Auth){
        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");

        /** Local form variables **/
        var email = $scope.email;
        var password = $scope.password;

        ref.authWithPassword({
            email    : "arturo@arturo.com",
            password : "hartur"
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                //$location.path('profile');

                return Auth.$authWithPassword({
                    email: email,
                    password: password
                },{
                    remember: "sessionOnly"
                }).then(function(authData){
                    console.log("Logged in as:", authData.uid);
                    $location.path('profile');
                }).catch(function(error){
                    console.error("Error: ", error);

                });
            }
        });

    }
]);



qsheets.controller('signupCtrl', [
    "$scope",
    "$rootScope",
    "$location",
    "$firebaseAuth",
    function($scope, $rootScope, $location, $firebaseAuth) {

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");
        $scope.authObj = $firebaseAuth(ref);


        // Check authentication state
        var authData = ref.getAuth();
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            $location.path('profile');
        } else {
            console.log("User is logged out");
        }

        //// Creates new user and save the user as an object
        $scope.signUp = function() {
            /** Local form variables **/
            var email = $scope.email;
            var password = $scope.password;

            $scope.authObj.$createUser({
                email: email,
                password: password
            }).then(function (userData) {
                console.log("User " + userData.uid + " created successfully!");

                return $scope.authObj.$authWithPassword({
                    email: email,
                    password: password
                },{
                    remember: "sessionOnly"
                });
            }).then(function (authData) {
                console.log("Logged in as:", authData.uid);
                $location.path('profile');
            }).catch(function (error) {
                console.error("Error: ", error);
            });
        }




    }

]);

qsheets.controller('profileCtrl', [
    "$scope",
    "$firebase",
    "$firebaseAuth",
    "Auth",
    function($scope, $firebaseAuth, Auth){

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");


        // Check authentication state
        var authData = ref.getAuth();
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            console.log("User is logged out");
        }




    }
]);

qsheets.controller('projectCtrl', [
    "$scope",
    "$firebase",
    function($scope, $firebase){
        var ref = new Firebase("https://qsheets.firebaseio.com");

        $scope.newEvent = {};
        $scope.events = $firebase(ref).$asArray();

        $scope.saveEvent = function(){
            $scope.newEvent.startDate = $scope.newEvent.startDate.toJSON();
            $scope.newEvent.endDate = $scope.newEvent.endDate.toJSON();
            console.log('before save: ', $scope.newEvent);
            $scope.events.$add($scope.newEvent);
            $scope.newEvent = {};
        };

        $scope.format = 'MM/dd/yyyy';

        $scope.today = function() {
            $scope.newEvent.startDate = new Date();
            $scope.newEvent.endDate = new Date();
            console.log('in today: ', $scope.newEvent);
        };
        $scope.today();

        $scope.clear = function () {
            $scope.newEvent.startDate = null;
            $scope.newEvent.endDate = null;
        };


        $scope.openStartDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openStart = true;
        };

        $scope.openEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openEnd = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: +1
        };

    }
]);

