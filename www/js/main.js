$(function() {

    var navBar = '.navbar-default';
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
    }

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