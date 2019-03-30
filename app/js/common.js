$(document).ready(function(){

    /**
     * mobile-mnu customization
     */
    var mmenu = $('#mobile-mnu');
    var menuLogo = mmenu.data("logo");
    var $mmenu = mmenu.mmenu({
        navbars: [{
            content: [ "<img src=" + menuLogo + " class=\"img-responsive mm-logo\" alt=\"alt\"/>" ],
            height: 3
        }],
        "pageScroll": true,

        "navbar": {
            "title" : "",
        },
        "extensions": [
            "theme-dark",
            "pagedim-black",
            // "position-front",
            "fx-listitems-slide",
        ],
    }, {
        offCanvas: {
            pageSelector: "#page-container"
        },
    });

    var mmenuBtn = $("#mmenu-btn");
    var API = $mmenu.data("mmenu");

    mmenuBtn.click(function() {
        API.open();
        $(this).addClass('is-active')
    });


    API.bind( "close:start", function() {
        setTimeout(function() {
            mmenuBtn.removeClass( "is-active" );
        }, 300);
    });
    /**
     * end mobile-mnu customization
     */


    $('.intro-slider').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 8000,
        fade: true,
        cssEase: 'linear',
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
    });

    $('.intro-news-slider').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        dots: true
    });




    function heightses() {

        if ($(window).width()>=768) {
            $('.project-item-title').matchHeight({byRow: true});
            $('.adv-item').matchHeight({byRow: true});
        }

        if ($(window).width()>=480) {
            $('.team-item-lastname').matchHeight({byRow: true});
            $('.team-item-name').matchHeight({byRow: true});
            $('.team-item-post').matchHeight({byRow: true});
        }

        $('.intro-news-slide .slide-title').height('auto').equalHeights();

    }

    $(window).resize(function() {
        heightses();
    });

    heightses();


    /**
     * YOUTUBE SCRIPT
     */
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var videoPlayers = [];
    var i = 0;

    onYouTubeIframeAPIReady = function () {
        $('.video-player .you-player').each(function(){
            var $playerID = $(this).attr("id");
            var $videoID = $(this).parents('.video-player').data("video");
            var $start = $(this).siblings('.start-video');

            $start.attr("data-playern", i);

            $start.on('click', function(){
                var playerN = $(this).attr("data-playern");
                $(this).hide();
                $(this).siblings('.you-player').show();
                $(this).siblings('.thumbnail-container').hide();


                videoPlayers[i] = new YT.Player($playerID, {
                    videoId: $videoID,
                    playerVars: {
                        'autoplay': 0,
                        'rel': 0,
                        'showinfo': 0
                    },
                    events: {
                        'onStateChange': onPlayerStateChange
                    }
                });

                if(videoPlayers[i])
                {
                    var fn = function(){ videoPlayers[i].playVideo(); };
                    setTimeout(fn, 1500);
                }

            });
            i++;
        });
    };

    var p = document.getElementsByClassName("you-player");
    $(p).hide();

    onPlayerStateChange = function (event) {
        if (event.data == YT.PlayerState.ENDED) {
            $('.you-player').hide();
            $('.start-video').fadeIn('normal');
            $('.thumbnail-container').fadeIn('normal');
        }
    };
    /**
     * end YOUTUBE SCRIPT
     */


    /**
     * MAPS
     */

    //Переменная для включения/отключения индикатора загрузки
    var spinner = $('.loader');
    //Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
    var check_if_load = false;
    //Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
    //var myMapTemp, myPlacemarkTemp;


    // ymaps.ready(function(){
    function init () {
        var mapId = $('#objectsmap'),
            attitude = mapId.data("att"),
            longtitude = mapId.data("long"),
            zoom = mapId.data("zoom"),
            marker = mapId.data("marker"),
            objMap = new ymaps.Map("objectsmap", {
                center: [attitude, longtitude],
                controls: ['zoomControl'],
                zoom: zoom
            });

        var i;
        var placemark;
        var dataObjects = [];

        $('#objectslist .om-item').each(function(){
           var  omAtt = $(this).data('att'),
                omLong = $(this).data('long'),
                omImg = $(this).data('img'),
                omTitle = $(this).data('title'),
                omData = [omAtt, omLong, omImg, omTitle];

            dataObjects.push(omData);
        });


        for (i = 0; i < dataObjects.length; ++i) {
            placemark = new ymaps.Placemark([[dataObjects[i][0]], dataObjects[i][1]], {
                balloonContent: '<div class="baloon-item"><div class="baloon-img" style="background-image: url('+ dataObjects[i][2] +');"></div><a href="#0" class="baloon-title">'+dataObjects[i][3]+'</a></div>'
            }, {
                iconLayout: 'default#image',
                // Своё изображение иконки метки.
                iconImageHref: marker,
                // Размеры метки.
                iconImageSize: [36, 51],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [0, 0],
                // Балун будем открывать и закрывать кликом по иконке метки.
                hideIconOnBalloonOpen: false,
                // Отключаем кнопку закрытия балуна.
                balloonCloseButton: false,
            });
            objMap.geoObjects.add(placemark);
        }


        objMap.behaviors.disable('scrollZoom');

        // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
        var layer = objMap.layers.get(0).get(0);

        // Решение по callback-у для определения полной загрузки карты
        waitForTilesLoad(layer).then(function() {
            // Скрываем индикатор загрузки после полной загрузки карты
            spinner.removeClass('is-active');
        });
    }






    // Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов)
    function waitForTilesLoad(layer) {
        return new ymaps.vow.Promise(function (resolve, reject) {
            var tc = getTileContainer(layer), readyAll = true;
            tc.tiles.each(function (tile, number) {
                if (!tile.isReady()) {
                    readyAll = false;
                }
            });
            if (readyAll) {
                resolve();
            } else {
                tc.events.once("ready", function() {
                    resolve();
                });
            }
        });
    }

    function getTileContainer(layer) {
        for (var k in layer) {
            if (layer.hasOwnProperty(k)) {
                if (
                    layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
                    || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
                ) {
                    return layer[k];
                }
            }
        }
        return null;
    }


    // Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
    function loadScript(url, callback){
        var script = document.createElement("script");

        if (script.readyState){  // IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  // Другие браузеры
            script.onload = function(){
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    // Основная функция, которая проверяет когда мы навели на блок с классом &#34;ymap-container&#34;
    var ymap = function() {
        $('.s-objectsmap').on( "mouseenter", function(){
            if (!check_if_load) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

                // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
                check_if_load = true;

                // Показываем индикатор загрузки до тех пор, пока карта не загрузится
                spinner.addClass('is-active');

                // Загружаем API Яндекс.Карт
                loadScript("https://api-maps.yandex.ru/2.1/?apikey=e470b388-a1d0-4edf-acdc-34b4bc5bedee&lang=ru_RU&loadByRequire=1", function(){
                    // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
                    ymaps.load(init);
                });
            }
        });
    };

    ymap();









    /**
     * end MAPS
     */




    var uPhone = $('.user-phone');
    uPhone.mask("+7 (999) 999-99-99",{autoclear: false});

    uPhone.on('click', function (ele) {
        var needelem = ele.target || event.srcElement;
        needelem.setSelectionRange(4,4);
        needelem.focus();
    });

    $.validate({
        form : '.contact-form',
        scrollToTopOnError: false
    });


    //E-mail Ajax Send
    $("form").submit(function() { //Change
        var th = $(this);

        $.ajax({
            type: "POST",
            url: "mail.php", //Change
            data: th.serialize()
        }).done(function() {

        });
        return false;
    });


    $('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);
        }, 'xml');
    });

});
