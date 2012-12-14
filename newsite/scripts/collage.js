/**
 * @version 12.12.1
 */
function Collage(conf) {
    conf = conf || {};
    this.id = conf.id || 'main';
    this.scrollbarWidth = (function scrollbarWidth() {
        var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
        // Append our div, do our calculation and then remove it
        $('body').append(div);
        var w1 = $('div', div).innerWidth();
        div.css('overflow-y', 'scroll');
        var w2 = $('div', div).innerWidth();
        $(div).remove();
        return (w1 - w2);
    }()) || 15; // if the scrollbar check fails then we'll guess its 15px
    this.imagesMeta = [{"src":"images/mainfotos/col1.1.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col2.1.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col3.1.jpg","width":1626,"height":1125},{"src":"images/mainfotos/col5.1.jpg","width":1582,"height":1134},{"src":"images/mainfotos/col6.1.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col4.1.jpg","width":850,"height":1276},{"src":"images/mainfotos/unik2.jpg","width":831,"height":1247},{"src":"images/mainfotos/col7.1.jpg","width":1304,"height":1134},{"src":"images/mainfotos/col8.1.jpg","width":1701,"height":978},{"src":"images/mainfotos/unik1.jpg","width":1469,"height":1128},{"src":"images/mainfotos/unik3.jpg","width":1701,"height":1134}];
    // randomize images
    shuffleArray(this.imagesMeta);
    // create an url-table
    this.urlTable = new Array(this.imagesMeta.length);    
    this.factor = 0.0;
    this.canvas = conf.canvas || $('.content');
    this.area = [this.canvas.width()-this.scrollbarWidth, $(window).height()];
    this.imgMargin = 10;
   /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     */
    function shuffleArray(array) {
        var j, temp;
        for (var i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        };
    }
}
with({o: Collage, p: Collage.prototype}) {                
    p.multiply = function(a,b){ return a*b; };
    p.imageArea = function(img1, img2) {
        return (Array.isArray(img1) ? img1.reduce(p.multiply) : img1) + img2.reduce(p.multiply);
    };
    p.resizeToCanvas = function(img, i, all) {
        all[i][0] = img[0] * this.factor;
        all[i][1] = img[1] * this.factor;
    };   
    p.placeImage = function(img, i, all) {
        //TODO: implement genetic algorithme for best fit, e.g. randomize image order and calc cost
        // Calc width of elements compared to canvas width
        var width = 0, bufferThreshold = 100, len = all.length;
        if( o.process && i === this.imagesPerRow) { // calc per row
            for (var n = i; n < len; ++n) {                        
                if( (width / this.area[0] * 100) < bufferThreshold ) {
                    width += all[n][0] + this.imgMargin;
                    console.log(
                        "Image %s takes %spx of space - total: %spx",
                        (n-i)+1,
                        all[n][0].toFixed(2),
                        width.toFixed(2)
                    );
                } else {
                    this.imagesPerRow = n;
                    break;
                }
            }
            if(n === len) {
                o.process = false;
                this.imagesPerRow = len;
            }    
            //firstImagePerRow.push(i);
            //console.log("i = " + i,"mod = " + ns.placeImage.mod, "image = " + ns.urlTable[i]);
            //var delta = (100 - width / this.area[0] * 100) / (n-i) / 100;
            //var delta = (100 - width / this.area[0] * 100) / 100;
            var delta = (this.area[0] - width) / (n-i), oldWidth;
            for (var n = i; n < this.imagesPerRow; ++n) {
                console.log(
                    "Resizing width: %s from %s to %s",
                    this.urlTable[n],
                    all[n][0].toFixed(2),
                    (all[n][0] + delta).toFixed(2)
                    //(all[n][0] + all[n][0] * delta).toFixed(2)
                );
                //all[n][0] = all[n][0] + all[n][0] * delta;      
                oldWidth = all[n][0];
                all[n][0] = Math.floor(all[n][0] + delta);                   // width
                all[n][1] = Math.floor(all[n][1] / oldWidth * all[n][0]);    // height
            }
        }                
    };
    p.createImages = function(images, urls) {
        var base = document.baseURI.replace(/\w+\.\w{3,4}$/, ''),
            html = ['<img alt="Photo by Rolando Diaz" src="http://src','','.sencha.io/jpg100/',,'/',,'/',base,,'" width="',,'" height="',,'" id="',,'"/>'],
            scene = this.canvas.find('.content-scene');
        if( scene.has('img').length ) {
             images.forEach(function alterImage(img, i, all) {
                 scene.find('#' + this.id + i).prop({ width: img[0], height: img[1] }).removeClass('positioned');
             }, this);
        } else {
            images.forEach(function insertImage(img, i, all) {
                //html[1] = i % 4 + 1;    // sencha io server shards
                html[3] = img[0];
                html[5] = img[1];
                html[8] = urls[i];
                html[10] = img[0];
                html[12]= img[1];
                html[14] = this.id + i;
                $(html.join(''))
                    .appendTo(scene);
            }, this);
        }
    };
    p.createCollage = p.recalc = function() {
        console.log(this.area);
        // initialize - could be placed somewhere else
        this.imageRectangles = this.imagesMeta.map(function(el, i) {
            this.urlTable[i] = el.src;    // update the urlTable
            return [el.width, el.height];
        }, this);
        // Calculate how much space the images needs shrunk/grown to fit the canvas
        this.factor = Math.sqrt(
            this.area.reduce(p.multiply) /
            this.imageRectangles.reduce(p.imageArea)
        );
        // end initialize - could be placed somewhere else
        // resize the images to fit in the canvas
        this.imageRectangles.forEach(p.resizeToCanvas, this);
        // place images in canvas
        o.process = true;
        this.imageRectangles.forEach(p.placeImage, this);
        o.process = true;
        this.imagesPerRow = undefined;
        this.createImages(this.imageRectangles, this.urlTable);
        // calc cost of layout - deferred
        var self = this;
        setTimeout(function costCalculator() {
            console.log(self.area.reduce(p.multiply) / self.imageRectangles.reduce(p.imageArea));
        }, 0);
        return this;
    };
    p.toString = function() {
        return this.id;
    }
}