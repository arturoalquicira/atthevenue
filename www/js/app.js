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
        .when('/profile',{
            templateUrl: '/views/profile.html',
            controller: 'profileCtrl'
        })
        .when('/dashboard',{
            templateUrl: '/views/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .when('/project/:projectId/:projectName', {
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
    "$firebase",
    function($scope, Auth, $location, $firebase){

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");

        //access to auth scope in the view
        $scope.auth = Auth;

        // Check authentication state and grabs de uid
        var authData = ref.getAuth();
        if (authData) {

        } else {
            console.log("User is logged out");
            $location.path('/');

        }
        var urlProfile = "https://qsheets.firebaseio.com/users/"+authData.uid;
        // Creates connection with db
        var urlRef = new Firebase(urlProfile);
        $scope.user = $firebase(urlRef.child('profile')).$asObject();



        // any time auth status updates, add the user data to scope
        Auth.$onAuth(function(authData) {

            //if user is authenticated will remain logged in
            if (authData) {
                console.log(authData.uid + " is successfully logged in!");
            } else {
                console.log("Logged out");
                $location.path('/'); // user is logged out
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
        //if user is authenticated will remain logged in
        if (authData) {
            $location.path('dashboard');
        } else { // user is logged out
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
                remember: "sessionOnly" //user will be logged in only if browser is opened

            // after being authenticated it redirects to dashboard
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
                    remember: "sessionOnly" //user will be logged in only if browser is opened
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
                $location.path('profile');

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

        // Check authentication state and grabs de uid
        var authData = ref.getAuth();
        if (authData) {
        } else {
            console.log("User is logged out");
            $location.path('/');

        }
        var urlProfile = "https://qsheets.firebaseio.com/users/"+authData.uid;
        // Creates connection with db
        var urlRef = new Firebase(urlProfile);
        $scope.user = $firebase(urlRef.child('profile')).$asObject();

        //// Stores user profile information
        $scope.profileForm = function() {

            // if user is authenticated it will save info in db
            if (authData) {

                $scope.user.$save($scope.user).then(function(ref) {

                }, function (error) {
                    console.log("Error:" + error);
                });
                $location.path('dashboard'); // if it went through it redirects user to dashboard
            } else {
                console.log("User is logged out");
                $location.path('dashboard');

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

        // Check authentication state and grabs de uid
        var authData = ref.getAuth();
        if (authData) {
        } else {
            console.log("User is logged out");
            $location.path('/');
        }

        // url and connection to store project id inside user array for future reference
        var urlProfile = "https://qsheets.firebaseio.com/users/"+authData.uid+"/projects";
        // Creates connection with db
        var urlRef = new Firebase(urlProfile);
        // connection to store project info in projects array
        $scope.userProjects = $firebase(urlRef).$asArray();


        // connection to store project info in projects array
        $scope.projects = $firebase(ref.child('projects')).$asArray();


        // cleans new project form
        $scope.newProject = {};

        // function to save project info from form
        $scope.saveProject = function(){

            // converts dates to json format
            $scope.newProject.startDate = $scope.newProject.startDate.toJSON();
            $scope.newProject.endDate = $scope.newProject.endDate.toJSON();

            //saves project info under projects array
            $scope.projects.$add($scope.newProject).then(function(ref) {
                var id = ref.key();
                console.log("added record with id " + id);
                $scope.projects.$indexFor(id); // returns location in the array

                //saves project id under user/projects
                $scope.userProjects.$add({
                    projectId: id
                });


            });

            // cleans new project form
            $scope.newProject = {};

        };

        /****** Date picker config *******/
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

        //End Date picker config

        // deletes project from projects array and user/projects array
        $scope.deleteProject = function($id){

            var projects = $scope.projects;
            var rec = projects.$getRecord($id);
            projects.$remove(rec);

        }




    }
]);

qsheets.controller('profileCtrl',[
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
    "$routeParams",
    "$firebase",
    function($scope, $location, Auth, $routeParams, $firebase){

        // Creates connection with db
        var ref = new Firebase("https://qsheets.firebaseio.com");

        // Check authentication state and grabs de uid
        var authData = ref.getAuth();
        var urlProject = "https://qsheets.firebaseio.com/projects/"+$routeParams.projectId;
        // Creates connection with db
        var urlRef = new Firebase(urlProject);
        $scope.project = $firebase(urlRef).$asObject();

        console.log($scope.project);

    }
]);



