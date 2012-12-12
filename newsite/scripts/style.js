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
 * @example ns.imageLoad([jquery image], [callback function]);
 * @param {jQuery} image
 * @param {function} cb
 */
ns.imageLoad = function(image, cb) {
    var puller = setInterval(function() {
        if(image.height() > 0) {
            clearInterval(puller);
            cb();
        }
    }, 0);
    image.on('load', function() {
        clearInterval(puller);
        cb();
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
        /*var numberOfImages = 0, numberOfImagesLoaded = 0;
        $('.content .collage').each(function(i,container){
            var $c = $(container), $img = $c.find('img');
            $img.on('load', function() {
                var info = $(
                    '<div class="info"><span>width: '
                    + $img.width()
                    + ' ('
                    + $img[0].naturalWidth
                    + ')</span><br/><span>height: '
                    + $img.height()
                    + ' ('
                    + $img[0].naturalHeight
                    + ')</span><br/>'
                    + '<span>Aspect ratio: ' + ns.gcd($img[0].naturalWidth, $img.width()) +':'+  ns.gcd($img[0].naturalHeight,$img.height()) + '</span></div>'
                );
                $c.prepend(info);
                numberOfImagesLoaded++;
                if(numberOfImagesLoaded == numberOfImages) {
                    //ns.layoutCollage($);
                    ns.growAside($, $('.content'));                    
                }
            });
            numberOfImages++;
        });*/
       // ns.layoutCollage($);
        //ns.growAside($, $('.content'));
    }
});