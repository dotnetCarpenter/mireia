/*
 * Image Meta
 * https://github.com/dotnetCarpenter/mireia/tree/master/newsite/node
 *
 * @auther dotnetCarpenter
 * @version 12.12.15.1
 * 
 * Copyright (c) 2012 dotnetCarpenter
 * Licensed under the MIT license.
 */
function meta(conf) {
    this.src = conf.src;
    this.width = conf.width;
    this.height = conf.height;
}

with({ p: exports, fs: require('fs'), im: require('imagemagick'), meta:meta }) {
    p.createArray = function(obj) {
        if(Array.isArray(obj))
            return obj;
        return [obj]
    };
    p.writeMetaObjects = function(filepath, images, verbose) {
        fs.exists(filepath, function writeStream (exists) {
            if(exists) {
                fs.readFile(filepath, function addJson(err, json) {
                    var metaData = [];
                    if(err) {
                        console.log(err)
                        return;
                    }
                    try {
                        metaData = JSON.parse(json);
                    } catch(err) {
                        console.log("JSON output is b0rken! %j", err);
                        return;
                    }
                    fs.writeFile(filepath, JSON.stringify(p.createArray(metaData).concat(p.createArray(images))), function errLogger (err) {
                        if(err) {
                            console.log(err)
                            return;
                        }
                    });
                });
            } else {
                fs.writeFile(filepath, JSON.stringify(images), function writeFileHandler(err) {
                    if(err) {
                        console.log(err)
                        return;
                    }
                });
            }
        });
    };
    p.readFolder = function(folder, cb, options) {
    	fs.readdir(folder, function fsReadDir(err, files) {
    		var images = [], callCounter = 0;
    		if(err)
    			return cb.call(cb, err);

    		files.forEach(function(file, i, all) {
				p.readFile(folder + file, function collectImages(err, image) {
					if(err)
    					return cb.call(cb, err);

    				if(image)
						images.push(image);
					
					callCounter++;
					
					if(callCounter === all.length)
						cb.call(cb, null, images);
				}, options);
    		});
    	});
    };
    p.readFile = function(path, cb, options) {
    	var shortpath = /^.+(?=\/)/,   // perhaps replace last slash too?
    		imageExtensions = /\.(jp[e]?g|jpe|jfif|jif|tiff|png|gif)$/, 
    		fileFilter = new RegExp(options.filter);

    	if(!imageExtensions.test(path) || options.filter && !fileFilter.test(path)) {
    		if(options.verbose)
    			console.log('Skipping %s', path, imageExtensions.test(path) ? "" : "- unsupported file format");
    		return cb(null, null);
    	}
    //console.log(options);

/*    	im.readMetadata(path, function(err, obj) {   // .readMetadata() only works on jpg	
    		if(err)
    			return cb.call(cb, err);

			cb.call(cb, null, new meta({
				src: 	path.replace(shortpath, ''),
				width:  obj.exif["exifImageWidth"],
				height: obj.exif["exifImageLength"]
			}));
		});*/
/*		TODO: look into using rdjpgcom as it seems to be common on unix/linux*/
		im.identify(path, function(err, obj){
    		if(err)
    			return cb.call(cb, err);

			cb.call(cb, null, new meta({
				src: 	options.prefix ? options.prefix + path.replace(shortpath, '') : path.replace(shortpath, ''),
				width:  obj.width,
				height: obj.height
			}));
		});
    };
}