//Define angular.module with dependencies: firebase, ngRoute, ui.bootstrap
var qsheets = angular.module('qsheets',['firebase','ngRoute', 'ui.bootstrap', 'ngFitText']);

qsheets.config(["$routeProvider", function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: '/views/home.html',
            controller: 'homeCtrl'
        })
        .when('/signup',{
            templateUrl: '/views/signup.html',
            controller: 'signupCtrl'
        })
        .when('/login',{
            templateUrl: '/views/login.html',
            controller: 'loginCtrl'
        })
        .when('/editProfile',{
            templateUrl: '/views/profile.html',
            controller: 'editProfileCtrl'
        })
        .when('/dashboard',{
            templateUrl: '/views/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .when('/project', {
            templateUrl: '/views/project.html',
            controller: 'projectCtrl'
        })
}]);

/*** Factories ***/
qsheets.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
    //connects with db
    var ref = new Firebase("https://qsheets.firebaseio.com/");
    //authenticates
    return $firebaseAuth(ref);
}]);

/*** Controllers ===> User Authentication ***/

qsheets.controller('logOut',[
    "$scope",
    "Auth",
    "$location",
    function($scope, Auth, $location){

        //access to auth scope in the view
        $scope.auth = Auth;

        // any time auth status updates, add the user data to scope
        Auth.$onAuth(function(authData) {
            $scope.authData = authData;

            if (authData) {
                console.log(authData.uid + " is successfully logged in!");
            } else {
                console.log("Logged out");
                $location.path('/');
            }
        });
    }
]);

qsheets.controller('loginCtrl',[
    "$scope",
    "Auth",
    "$location",
    function($scope, Auth, $location){

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");

        // Check authentication state
        var authData = ref.getAuth();
        if (authData) {
            $location.path('dashboard');
        } else {
            console.log("User is logged out");
        }


        // logiIn form
        $scope.logIn = function(){
            /** Local form variables **/
            var email = $scope.email;
            var password = $scope.password;

            //authenticates the user with password
            Auth.$authWithPassword({
                    email    : email,
                    password : password
                },{
                remember: "sessionOnly"
            }).then(function(authData) {

                    //console.log("Authenticated successfully with payload:", authData);
                    $location.path('dashboard');

            }).catch(function(error)
            {
                if (error) {
                    console.log("Login Failed!", error);
                }

            });

        };//no tocar

    }
]);

qsheets.controller('signupCtrl', [
    "$scope",
    "$rootScope",
    "$location",
    "Auth",
    "$firebase",
    function($scope, $rootScope, $location, Auth, $firebase) {


        //// Creates new user and save the user as an object
        $scope.signUp = function() {
            /** Local form variables **/
            var email = $scope.email;
            var password = $scope.password;

            // creates user in firebase
            Auth.$createUser({
                email: email,
                password: password
            }).then(function (userData) {
                //console.log("User " + userData.uid + " created successfully!");

                //authenticates the new user created
                return Auth.$authWithPassword({
                    email: email,
                    password: password
                },{
                    remember: "sessionOnly"
                });
            }).then(function (authData) {
                // Creates connection with db
                var ref = new Firebase("https://qsheets.firebaseio.com/users/"+authData.uid);

                //saves user in db
                var user = $firebase(ref.child('account')).$asObject();
                user.info = authData;
                user.$save().then(function(ref) {

                }, function (error) {
                    console.log("Error:" + error);
                });
                //console.log("Logged in as:", authData.uid);
                $location.path('editProfile');

            }).catch(function (error) {
                console.error("Error: ", error);
            });

        }; //no tocar

    }

]);

/*** Controllers ===> Profile, Account, Projects ***/


qsheets.controller('homeCtrl',[
    "$scope",
    "Auth",
    "$location",
    function($scope, Auth, $location){

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");


        // Check authentication state
        var authData = ref.getAuth();
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            $location.path('dashboard');
        } else {
            console.log("User is logged out");
        }

    }
]);

qsheets.controller('editProfileCtrl', [
   "$scope",
    "Auth",
    "$location",
    "$firebase",
    function($scope, Auth, $location, $firebase){

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");


        //// Stores user profile information
        $scope.profileForm = function() {

            /** Local form variables **/
            var firstName = $scope.firstName;
            var lastName = $scope.lastName;
            var email = $scope.email;
            var phone = $scope.phone;
            var companyName = $scope.companyName;
            var position = $scope.position;



            // Check authentication state and grabs de uid
            var authData = ref.getAuth();
            var urlProfile = "https://qsheets.firebaseio.com/users/"+authData.uid;
            // Creates connection with db
            var urlRef = new Firebase(urlProfile);
            if (authData) {

                //saves profile in db
                var user = $firebase(urlRef.child('profile')).$asObject();
                user.info = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    companyName: companyName,
                    position: position
                };
                user.$save().then(function(ref) {

                }, function (error) {
                    console.log("Error:" + error);
                });
                $location.path('dashboard');
            } else {
                console.log("User is logged out");
            }

        }; //no tocar



    }
]);

qsheets.controller('dashboardCtrl', [
    "$scope",
    "Auth",
    "$location",
    "$firebase",
    function($scope, Auth, $location, $firebase){

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");

        $scope.newProject = {};

        // Check authentication state and grabs de uid
        var authData = ref.getAuth();
        var urlProfile = "https://qsheets.firebaseio.com/users/"+authData.uid;
        console.log('connecting');
        // Creates connection with db
        var urlRef = new Firebase(urlProfile);
        $scope.projects = $firebase(urlRef.child('projects')).$asArray();

        $scope.saveProject = function(){



            $scope.newProject.startDate = $scope.newProject.startDate.toJSON();
            $scope.newProject.endDate = $scope.newProject.endDate.toJSON();
            $scope.projects.$add($scope.newProject).then(function(ref) {
                var id = ref.key();
                console.log("added record with id " + id);
                $scope.projects.$indexFor(id); // returns location in the array
            });
            $scope.newProject = {};

        };

        $scope.format = 'dd-MMMM-yyyy';


        $scope.clear = function () {
            $scope.newProject.startDate = null;
            $scope.newProject.endDate = null;
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

        $scope.minDate = new Date();

        $scope.deleteProject = function($id){

            var list = $scope.projects;
            var rec = list.$getRecord($id);
            list.$remove(rec);

        }




    }
]);

qsheets.controller('profile',[
   "$scope",
    "Auth",
    "$location",
    "$firebase",
    function($scope, Auth, $location, $firebase){

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");

        // Check authentication state and grabs de uid
        var authData = ref.getAuth();
        var urlProfile = "https://qsheets.firebaseio.com/users/"+authData.uid;
        // Creates connection with db
        var urlRef = new Firebase(urlProfile);
        $scope.user = $firebase(urlRef.child('profile/info')).$asObject();


    }
]);

qsheets.controller('projectCtrl', [
    "$scope",
    "$location",
    "Auth",
    function($scope, $location, Auth){
        var eventsRef = new Firebase("https://qsheets.firebaseio.com/events");

    }
]);



