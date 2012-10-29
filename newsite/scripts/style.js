var ns = {}
ns.growAside = function($, img) {
    $('aside').height(
        $(img).height()
    )
}
ns.layoutCollage = function($) {
    var $container = $('.content')
    $container.imagesLoaded(function() {
        if($container.masonry) {
            $container.masonry({
                // options
                itemSelector : 'img'
            })
        } else if($container.isotope) {
            $container.isotope()
        }
    });
}

jQuery(function($){
    var $body = $('body')
    if($body.hasClass('about_us')) {
        $('#background-image').load(function() {
            ns.growAside($, this)
            
        })
    }
    if($body.hasClass('collections')) {
        ns.layoutCollage($)
    }
});