/*
 * Image Meta
 * https://github.com/dotnetCarpenter/mireia/tree/master/newsite/node
 *
 * @auther dotnetCarpenter
 * @version 12.12.1
 * 
 * Copyright (c) 2012 dotnetCarpenter
 * Licensed under the MIT license.
 */
function meta(conf) {
    this.src = conf.src;
    this.width = conf.width;
    this.height = conf.height;
}

with({ p: exports, fs: require('fs'), im: require('imagemagick') }) {
    p.buildImageMetaObjects = function(images) {
        images.forEach(function getMetaObject(img) {
        	;
        });
        /*$('.content img').each(function(i, el) {
            metaData.push(new meta({ src: el.src.replace(/^.+(?=images\/)/, ''), width: el.naturalWidth, height: el.naturalHeight }));
        });*/
        return this.metaData;
    };
    p.writeMetaObjects = function(filepath) {
        console.log(
            JSON.stringify(
                getImageMeta()
            )
        );
    };
    p.readFolder = function(folder, cb) {
    	var self = this;
    	fs.readdir(folder, function(err, files) {
    		if(err)
    			return cb.call(cb, err);
    		files.forEach(function(file, i){
    			//if(i === 1)
    				p.readFile(folder + file);
    		});
    		//cb.call(cb, self.metaData);
    	});
    };
    p.readFile = function(path) {
		// winner!
		im.identify(['-format', 'width: %w height: %h', path], function(err, obj){
    		if(!err)
		  		console.log("[imagemagick::identify::format] %s %s", path.replace(/^.+(?=images\/)/, ''), obj);
		});		
    }
    p.readFileIterator = function(file, i, all) {
    	//console.log(file);
    	this.metaData.push(new meta({ src: file, width:0, height:0 }));
    };
}