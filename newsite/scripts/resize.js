/**
 *  Resizer idea that isn't needed.... for now 
 * depends on:
 * <link rel="stylesheet" href="http://code.jquery.com/ui/1.9.1/themes/base/jquery-ui.css">
 * <!--<script src="http://code.jquery.com/ui/1.9.1/jquery-ui.js"></script>-->
 */ 

jQuery('.content img').draggable({ grid: [ 3, 3 ] }).on('mousedown', function(e){
/*             if(e.pageY > (height+this.offsetTop-16) && e.pageX > (width+this.offsetLeft-16)) {
        $img.one('mousemove', function(e) {
            
        })
        $img.css('cursor', 'se-resize')
        console.log("Y", e.pageY, $img.height()+this.offsetTop-16)
        console.log("X", e.pageX, $img.width()+this.offsetLeft-16)
        
        $img.height(height+10), $img.width(width+10)
    } else {
//        $('#sq').css('backgroundColor', 'black');
        $img.css('cursor', 'default')
    }*/
});

//$('#sq').css({ top: 436, left: 319 })/* pageY, pageX */

function Resizer(img){
    this.img = img
    this.height = img.height
    this.width = img.width
    this.lt = [ img.offsetLeft, img.offsetTop ]
    this.rt = [ lt[0] + this.width, lt[1] ]
    this.lb = [ lt[0], lt[1] + this.height ]
    this.rb = [ rt[0] , lb[1] ]
}

Resizer.prototype.resize(ratio) {
    var newHeight = this.height + ratio, newWidth = this.width  + ratio
    ratio = ratio > 10 ? % 4 : ratio  // slow down
    this.img.height = this.height = newHeight
    this.img.width  = this.width  = newWidth    
  //  console.log(ratio)
}

function getImg(e) {
    // only get image if it's with 16px of a corner
    
}

jQuery('.content img').each(function (i, img) { new Resizer(img) })

jQuery(document).on('mousedown'), function(e) {
    getImg(e).
}).on('mouseup', function() {
    console.log('mouseup')
    $(this).off('mousemove.resize')
    $(this).draggable("enable")
    this.style.zIndex = 2
})

jQuery('.content img').on('mousemove', function(e){
    var $img = $(this);
    var height = $img.height(), width = $img.width(),
        rbCornerX = width+this.offsetLeft, rbCornerY = height+this.offsetTop
//    $('#sq').css({ top: e.pageY-5, left: e.pageX-5, zIndex: "+100" })
    if(e.pageY > (rbCornerY-16) && e.pageX > (rbCornerX-16)) {
        console.dir(e)
//        $('#sq').css('backgroundColor', 'red');
        console.log('STOP::draggable')
        $img.draggable("disable")
        $(document).on('mousemove.resize', function(e) {
            resize($img, e.pageX-rbCornerX)
        })
        $img.css('cursor', 'se-resize')
     //   console.log("Y", e.pageY, rbCornerY-16)
     //   console.log("X", e.pageX, rbCornerX-16)
    } else {
//        $('#sq').css('backgroundColor', 'black');
        $img.css('cursor', 'default')
    }
})
$(document).on('mouseup', function() {
    console.log('mouseup')
    $(this).off('mousemove.resize')
    $(this).draggable("enable")
     this.style.zIndex = 2
}).on('dragstart', function(e) {
    console.log('dragstart')
    this.style.zIndex = 4
})