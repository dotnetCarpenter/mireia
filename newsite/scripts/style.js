var ns = {}
ns.growAside = function(img) {
    $('aside').height(
        $(img).height()
    )
}

jQuery(function($){
    $('#background-image').load(function() {
        ns.growAside(this)
        
    })
});