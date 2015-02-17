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
    function($scope, $firebase){

    }
]);

qsheets.controller('loginCtrl',[
    "$scope",
    "$firebase",
    function($scope, $firebase){

    }
]);



qsheets.controller('signupCtrl', [
    "$scope",
    "$rootScope",
    "$location",
    "$firebase",
    function($scope, $rootScope, $location, $firebase) {

        var ref = new Firebase('https://qsheets.firebaseio.com/users');
        var authClient = new FirebaseSimpleLogin(ref, function(error, user) {

        });


        $scope.signUp = function(){
            var email = $scope.email;
            var password = $scope.password;

            authClient.createUser(email, password, function(error, user) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            break;
                        default:
                            console.log("Error creating user:", error);
                    }
                } else {
                    var list = $firebase(ref).$asArray();
                    list.$add({
                        id: user.uid,
                        email: user.email
                    }).then(function(ref) {
                        var id = ref.key();
                        console.log("added record with id " + id);
                        list.$indexFor(id); // returns location in the array
                        $location.path('profile');
                    });
                    console.log("Successfully created user account with uid:", user.uid);
                }
            });






        };




    }

]);



qsheets.controller('profileCtrl', [
    "$scope",
    "$firebase",
    function($scope, $firebase){

    }
]);

qsheets.controller('projectCtrl', [
    "$scope",
    "$firebase",
    function($scope, $firebase){

    }
]);

