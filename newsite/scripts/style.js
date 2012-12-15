var ns = ns || {};
/*
ns.gcd = function(a, b) {
  return b ? ns.gcd(b, a % b) : a;
};*/

ns.growAside = function($, elementToMatch) {
    $('aside').height(
        $(elementToMatch).height()
    );
};
/**
 * Can be used on an image to fire a callback when the image is loaded even if the load event is never fired.
 * This hack only works if you don't set any height on the image!
 * @example ns.imageLoad([jquery image], [callback function]);
 * @param {jQuery} image
 * @param {function} cb
 */
ns.imageLoad = function(image, cb) {
    var puller = setInterval(function() {
        if(image.height() > 0) {
            clearInterval(puller);
            cb(image);
        }
    }, 0);
    image.on('load', function() {
        clearInterval(puller);
        cb(image);
    });
};
jQuery(function($){
    var $body = $('body');
    if($body.hasClass('about_us')) {
        var $bgImage = $('#background-image');
        ns.imageLoad($bgImage, function cb() {
            ns.growAside($, $bgImage);
            $('.overlay[rel="background-image"]')
                .css({ height: $bgImage.height(), width: $bgImage.width() })
                .removeClass("hide")
            ;
        });
    }

    if($body.hasClass('collections')) {
        var $content = $('.content');
        var collage = new Collage();
        var subCollages = [];
        collage.createCollage();
        // absolute position all collage images so we can create effects        
        /*$('#content-scene img').on('load', function(e) {
            this.style.top = this.offsetTop + 'px';
            this.style.left = this.offsetLeft + 'px';
            this.className = 'positioned';      
        });*/
        function fixBrokenImages($broken) {
            var re = /\?reload=(\d)$/
            $broken.one('error', function () {
                if( this.src.match(re)[1] < 3 ) { // only try twice
                    fixBrokenImages($(this));
                }
            }).each(function(i, img) {
                var tries = img.src.match(re);
                img.src = img.src.replace(re, '') + '?reload=' + (tries ? ++tries[1] : 1);
                console.log("tries: %s \nsrc: %s", (tries ? tries[1] : 1), img.src);
            });
        }
        function positionImages($images) {
            // find and set the coordinates of loaded images
            $images.each(function(i, img){
                $(img).css({
                    top: img.offsetTop,
                    left:img.offsetLeft
                });
            });
            $images.addClass('positioned');
        }
        $('.content-scene img').imagesLoaded(function($images, $proper, $broken) {
            // reload broken images
            if($broken.length)
                fixBrokenImages($broken);
            // position images
            positionImages($images.parent());
            // create new scenes behind the images
           /* $images.each(function createScenes(i, img) {
                $('<div class="back" style="width:' + img.width + 'px;height:' + img.height + 'px;" />').insertAfter(img).parent().on('click', function toggleFlip() {
                    $(this).toggleClass('flipped');
                });
            });*/
            var backsideHTML = ['<div class="back content-scene" style="width:',,'px;height:',,'px;" />']
            $images.each(function createScenes(i, img) {
                backsideHTML[1] = img.width;
                backsideHTML[3] = img.height;
                var backsideCollage = new Collage(
                {
                    canvas: $(backsideHTML.join(''))
                                .insertAfter(img)
                                .parent()
                                .on('click', function toggleFlip() {
                                    $(this).toggleClass('flipped');
                               })
                  , id: img.id + 'sub'
                });
                backsideCollage.debug = true;
                //if(i !== 10)
                //    return;
                subCollages.push( backsideCollage.createCollage() );
            });
        });        
        ns.growAside($, $content);        
        // set the scene for effects
        $('.content-scene').css({ width: $content.width(), height: $content.height() });
        
        // set handling browser resizing
        var resizeTimeout;
        $(window).resize(function() {
            if(resizeTimeout)
                clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeHandler, 300);
        });
        function resizeHandler() {
            $('.content-scene').attr('style', '');
            collage.area = [collage.canvas.width()-collage.scrollbarWidth, $(window).height()];
            collage.recalc();
            // set the scene for effects
            $('.content-scene').css({ width: $content.width(), height: $content.height() });
            setTimeout(function() {
                positionImages($('.collage-item'));
                ns.growAside($, $content);
            }, 200);            
        }
        
        
    }
});