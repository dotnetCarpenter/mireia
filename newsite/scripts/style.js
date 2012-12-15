var ns = ns || {};
/*
ns.gcd = function(a, b) {
  return b ? ns.gcd(b, a % b) : a;
};*/

// image meta data
ns.main = [{"src":"images/mainfotos/col1.1.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col2.1.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col3.1.jpg","width":1626,"height":1125},{"src":"images/mainfotos/col5.1.jpg","width":1582,"height":1134},{"src":"images/mainfotos/col6.1.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col4.1.jpg","width":850,"height":1276},{"src":"images/mainfotos/unik2.jpg","width":831,"height":1247},{"src":"images/mainfotos/col7.1.jpg","width":1304,"height":1134},{"src":"images/mainfotos/col8.1.jpg","width":1701,"height":978},{"src":"images/mainfotos/unik1.jpg","width":1469,"height":1128},{"src":"images/mainfotos/unik3.jpg","width":1701,"height":1134}];
ns.col1 = [{"src":"images/mainfotos/col1.1.jpg","width":1701,"height":1134},{"src":"images/subfotos/col1.2.jpg","width":1701,"height":1134},{"src":"images/subfotos/col1.5.jpg","width":1701,"height":1134},{"src":"images/subfotos/col1.3.jpg","width":1701,"height":1134},{"src":"images/subfotos/col1.4.jpg","width":1701,"height":1134}];
ns.col2 = [{"src":"images/subfotos/col3.2.jpg","width":1107,"height":1701},{"src":"images/subfotos/col3.4.jpg","width":1701,"height":1134},{"src":"images/subfotos/col3.3.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col3.1.jpg","width":1626,"height":1125}];
ns.col3 = [{"src":"images/subfotos/col3.2.jpg","width":1107,"height":1701},{"src":"images/subfotos/col3.4.jpg","width":1701,"height":1134},{"src":"images/subfotos/col3.3.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col3.1.jpg","width":1626,"height":1125}];
ns.col4 = [{"src":"images/mainfotos/col4.1.jpg","width":850,"height":1276},{"src":"images/subfotos/col4.2.jpg","width":1128,"height":1458},{"src":"images/subfotos/col4.4.jpg","width":1678,"height":1130},{"src":"images/subfotos/col4.3.jpg","width":1701,"height":1134}];
ns.col5 = [{"src":"images/mainfotos/col5.1.jpg","width":1582,"height":1134},{"src":"images/subfotos/col5.3.jpg","width":4984,"height":3936},{"src":"images/subfotos/col5.2.jpg","width":5360,"height":3936}];
ns.col6 = [{"src":"images/subfotos/col6.2.jpg","width":1134,"height":1701},{"src":"images/subfotos/col6.3.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col6.1.jpg","width":1701,"height":1134}];
ns.col7 = [{"src":"images/mainfotos/col7.1.jpg","width":1304,"height":1134},{"src":"images/subfotos/col7.2.jpg","width":1478,"height":1132},{"src":"images/subfotos/col7.3.jpg","width":1134,"height":1701}];
ns.col8 = [{"src":"images/subfotos/col8.2.jpg","width":1603,"height":870},{"src":"images/subfotos/col8.3.jpg","width":1607,"height":926},{"src":"images/mainfotos/col8.1.jpg","width":1701,"height":978}];
ns.unik1 = [{"src":"images/mainfotos/unik1.jpg","width":1469,"height":1128}];
ns.unik2 = [{"src":"images/mainfotos/unik2.jpg","width":831,"height":1247}];
ns.unik3 = [{"src":"images/mainfotos/unik3.jpg","width":1701,"height":1134}];

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
        var collage = new Collage({ meta: ns.main });
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
            var backsideHTML = ['<div class="back content-scene" style="width:',,'px;height:',,'px;" />'],
                collection = /(col|unik)\d{1,2}/;
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
                  , meta: ns[img.src.match(collection)[0]]
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