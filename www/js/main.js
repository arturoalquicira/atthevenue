
// Navbar animation (only landing page)
$(function() {
    var navBar = '#navbar-scroll';
    var mqMd = window.matchMedia('(min-width: 768px)');

    function scrollerAnim(){
        $(window).scroll(function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop >= 1 && scrollTop <= 669) {
                $(navBar).stop().animate({top: '-90px'}, 50);
            }else if(scrollTop >= 700){
                $(navBar).stop().animate({
                        top: '0'},
                    50).css({
                        'background-color': '#282828',
                        'border-color': '#282828'});
            }else {
                $(navBar).stop().animate({top: '0'}, 300).css({
                    'background-color': 'transparent',
                    'border-color': 'transparent'
                });
            }
        });//end
    }
    function scrollerAnimSm(){
        $(window).scroll(function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop >= -1000 && scrollTop <= 10) {
                $(navBar).stop().css({
                    'background-color': 'transparent',
                    'border-color': 'transparent'});
            }else if(scrollTop){
                $(navBar).stop().css({
                    'background-color': '#282828',
                    //'border-color': '#282828',
                    '-webkit-transition': 'background-color 0.3s linear',
                    'transition': 'background-color 0.3s linear'
                });
            }else{
                $(navBar).stop();
            }
        });//end
    };

    if(mqMd.matches){
        scrollerAnim();
    }else {
        scrollerAnimSm()
    }

    mqMd.addListener(function(changed){
        if(changed.matches) {
            scrollerAnim();
        }else{
            scrollerAnimSm()
        }//end
    });

});

//Dropdown
atthevenue.controller('DropdownCtrl', function ($scope, $log) {
    $scope.items = [
        'The first choice!',
        'And another choice for you.',
        'but wait! A third!'
    ];

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
});

//Tabs
angular.module('ui.bootstrap.demo', ['ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('TabsDemoCtrl', function ($scope, $window) {
    $scope.tabs = [
        { title:'Dynamic Title 1', content:'Dynamic content 1' },
        { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];

    $scope.alertMe = function() {
        setTimeout(function() {
            $window.alert('You\'ve selected the alert tab!');
        });
    };
});