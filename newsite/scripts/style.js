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
        var collage = new Collage();
        collage.createCollage();
        ns.growAside($, $('.content'));
    }
});