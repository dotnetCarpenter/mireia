/**
 * @version 12.12.1
 */
function Collage(conf) {
    conf = conf || {};
    this.id = conf.id || 'main';
    this.debug = conf.debug || false;
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
    this.imagesMeta = conf.meta;
    // randomize images
    shuffleArray(this.imagesMeta);
    // create an url-table
    this.urlTable = new Array(this.imagesMeta.length);    
    this.factor = 0.0;
    this.canvas = conf.canvas || $('.content');
    this.area = [this.canvas.width()-this.scrollbarWidth, $(window).height()];
    this.imgMargin = 10;
    this.lastImageIndex = 0;
    this.firstImagePerRow = [];
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
with({p: Collage.prototype}) {
    /**
     * Capitalize the first letter in the supplied string
     * @param {String} s A string where you want the first letter to be upper-case.
     */
    p.capitalize = function (s) {
        return s.replace(/^(\w)/, function(r) { return r.toUpperCase(); });
        /* /\b(\w){1}?/g would match the first letter in any word (? makes it non-greedy) */
    };
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
        if( i === this.lastImageIndex) { // calc per row
            for (var n = i; n < len; ++n) {                        
                if( (width / this.area[0] * 100) < bufferThreshold ) {
                    width += all[n][0] + this.imgMargin;
                    if(this.debug)
                        console.log(
                            "Image %s takes %spx of space - total: %spx (%s%)",
                            (n-i)+1,
                            all[n][0].toFixed(2),
                            width.toFixed(2),
                            (width / this.area[0] * 100).toFixed(2)
                        );
                } else {                    
                    break;
                }
            }
            this.lastImageIndex = n;
            this.firstImagePerRow.push(i);
            //console.log("i = " + i,"mod = " + ns.placeImage.mod, "image = " + ns.urlTable[i]);
            //var delta = (100 - width / this.area[0] * 100) / (n-i) / 100;
            //var delta = (100 - width / this.area[0] * 100) / 100;
            var delta = (this.area[0] - width) / (n-i), oldWidth;
            for (var n = i; n < this.lastImageIndex; ++n) {
                if(this.debug)
                    console.log(
                        "Resizing width: %s from %s to %s",
                        this.urlTable[n],
                        all[n][0].toFixed(2),
                        Math.floor(all[n][0] + delta)
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
        //    html = ['<img alt="Photo by Rolando Diaz" src="http://src','','.sencha.io/jpg100/',,'/',,'/',base,,'" width="',,'" height="',,'" id="',,'"/>'],
            style = ['width:',,'px;height:',,'px;'],
            html = ['<div class="collage-item" id="collage',,'" style="',,'"><img alt="Photo by Rolando Diaz" src="',,'" width="',,'" height="',,'" id="',,'"/></div>'],
            scene = this.canvas.find('.content-scene'),
            id;
        if( scene.has('img').length ) {
             images.forEach(function alterImage(img, i, all) {
                scene.find('#' + this.id + i)
                    .prop({ width: img[0], height: img[1] })
                    .parent()
                    .removeClass('positioned')
                    .css({ width: img[0], height: img[1] });
             }, this);
        } else {
            images.forEach(function insertImage(img, i, all) {
                id = this.id + i;
                style[1] = img[0];
                style[3] = img[1];
                //html[1] = i % 4 + 1;    // sencha io server shards
                /*html[3] = img[0];
                html[5] = img[1];
                html[8] = urls[i];
                html[10] = img[0];
                html[12]= img[1];
                html[14] = this.id + i;*/
                html[1] = p.capitalize(id);
                html[3] = style.join('');
                html[5] = urls[i];
                html[7] = img[0];
                html[9] = img[1];
                html[11] = id;
                $(html.join(''))
                    .appendTo(scene);
            }, this);
        }
    };
    p.createCollage = p.recalc = function() {
        if(this.debug)
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
        this.imageRectangles.forEach(p.placeImage, this);
        this.lastImageIndex = 0;    // reset
        this.createImages(this.imageRectangles, this.urlTable);
        // calc cost of layout - deferred
        var self = this;
        if(this.debug)
            setTimeout(function costCalculator() {
                console.log(self.area.reduce(p.multiply) / ( self.imageRectangles.reduce(p.imageArea) + self.firstImagePerRow.length * self.imgMargin ));
                console.dir(self.firstImagePerRow);
            }, 0);
        return this;
    };
    p.toString = function() {
        return this.id;
    }
}