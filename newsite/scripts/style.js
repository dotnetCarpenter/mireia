var ns = ns ||{}
//ns.l = function(fn) { return function() { fn.call(fn); } }

ns.gcd = function(a, b) {
  return b ? ns.gcd(b, a % b) : a;
};
ns.reziseImage = function(img, factor) {
    var $img = $(img);
    $img.height((img.naturalHeight) * Math.sqrt(factor));
    //$img.width(img.naturalWidth*Math.sqrt(factor));
};
ns.sum = function(a,b){ return a+b; };
ns.multi = function(a,b){ return a*b; };
ns.calculateFactor = function(imagesizes) {
    var imgSum2 = imagesizes.reduce(ns.sum),
        containerSum2 = $('.content').width() * $(window).height();
    return containerSum2/imgSum2;
};
function Rectangle(config) {
    this.src = config && config.src;
    this.height = config && config.height;
    this.width = config && config.width;
}
Rectangle.prototype.factor = 0.0;
Rectangle.prototype.availHeight = $(window).height();
Rectangle.prototype.availWidth = $('.content').width();

ns.layoutCollage = function($) {
    var img2 = [], factor = 0.0;
    
    function eachImg(fn) {
        $('.content img').each(function(i, el){
            fn.call(fn, el, i);
        });
    }
    function collectImageArea(el, i) {
        var width = el.naturalWidth, height = el.naturalHeight;
        img2.push(width * height);
    }
    // collect area of images
    eachImg(collectImageArea);
    factor = ns.calculateFactor(img2);
    eachImg(function(el, i) {
        ns.reziseImage(el, factor);
    });
    /*
    var $container = $('.content');
    $container.imagesLoaded(function() {
        if($container.masonry) {
            $container.masonry({
                // options
                itemSelector : '.collage'
            });
        } else if($container.isotope) {
            $container.isotope({
                columnWidth: $container.width() / 4
              , sortBy: 'random'
            });
            $(window).smartresize(function() {
                $container.isotope({
                    columnWidth: $container.width() / 4
                });
            });
        }
    });*/
};
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