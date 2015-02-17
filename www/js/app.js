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

        $scope.signUp = function(){
            var email = $scope.email;
            var password = $scope.password;

            var authClient = new FirebaseSimpleLogin(ref, function(error, user) {

            });
            authClient.createUser(email, password, function(error, user) {

                if (error === null) {
                    console.log("User created successfully:", user);
                    //ref.set(user);
                    var list = $firebase(ref).$asArray();
                    list.$add(user).then(function(ref) {
                        var id = ref.user.id;
                        console.log("added record with id " + id);
                        list.$indexFor.key(); // returns location in the array
                        $location.path('profile');
                    });
                    console.log('hasta aqui');


                } else {
                    console.log("Error creating user:", error);
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

