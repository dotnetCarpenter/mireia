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
        collage.createCollage();
        // absolute position all collage images so we can create effects        
        /*$('#content-scene img').on('load', function(e) {
            this.style.top = this.offsetTop + 'px';
            this.style.left = this.offsetLeft + 'px';
            this.className = 'positioned';      
        });*/
        $('#content-scene img').imagesLoaded(function($images, $proper, $broken) {
            $proper.each(function(i, img){
                $(img).css({
                    top: img.offsetTop,
                    left:img.offsetLeft
                })
            });
            $proper.addClass('positioned');
        });
        
        ns.growAside($, $content);
        
        // set the scene for effects
        $('#content-scene').css({ width: $content.width(), height: $content.height() });        
        
        // set handling browser resizing
        var resizeTimeout;
        $(window).resize(function() {
            if(resizeTimeout)
                clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeHandler, 400);
        });
        function resizeHandler() {
            $('#content-scene').attr('style', '');
            collage.area = [collage.canvas.width()-collage.scrollbarWidth, $(window).height()];
            collage.recalc();
            // set the scene for effects
            $('#content-scene').css({ width: $content.width(), height: $content.height() });
            setTimeout(function() {
                $('#content-scene img').each(function(i, img){
                    $(img).css({
                        top: img.offsetTop,
                        left:img.offsetLeft
                    })
                });
                $('#content-scene img').addClass('positioned');
                ns.growAside($, $content);
            }, 200);            
        }
    }
});