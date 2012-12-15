/*
 * Image Meta
 * https://github.com/dotnetCarpenter/mireia/tree/master/newsite/node
 *
 * @auther dotnetCarpenter
 * @version 12.15.1
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
    p.writeMetaObjects = function(filepath, images, verbose) {
        //TODO: if several objects are written to file, the JSON is invalid. remove: '][' from file
    	/*if(verbose)
			console.log("Will append to %s", filepath);*/
		//fs.createWriteStream(filepath, { flags:"a" }).end(JSON.stringify(images));
        var seperators = /(\]\[|\}\{)/g;
        //var buffer = new Buffer(JSON.stringify(images), "utf8");
        var appendStream = fs.createWriteStream(filepath, { flags: "a", encoding: "utf8" });
        var overwriteStream = fs.createWriteStream(filepath, { flags: "w", encoding: "utf8" });
        var readStream = fs.createReadStream(filepath, { encoding: "utf8" });

        console.log(images);
        //console.dir(appendStream);
        //console.dir(overwriteStream);
        
        readStream.on("data", function(json) {
            console.log("data", json);
            if( seperators.test(json) ) {
                console.log("we got wrong json");
                overwriteStream.write(json.replace(seperators, function(match) {
                    if(match === "}{")
                        return "},{";
                    if(match === "][")
                        return ",";
                    //console.log("a %s, b %s, c %s, d %s", a,b,c,d);
                }));
            }
            appendStream.on("drain", function() { console.log("drain"); appendStream.destroySoon(); overwriteStream.destroySoon(); readStream.destroy(); });
            
        });
        readStream.pipe(appendStream, { end: false });
        appendStream.write(JSON.stringify(images));

    	/*
    	fs.exists(filepath, function writeStream (exists) {
    		if(verbose)
    			console.log(append ? "TODO: Will append to %s" : "Will write to %s", filepath);
            if(exists) {

            } else {
                fs.createWriteStream(filepath, { flags: append ? "a" : "w" }).end(JSON.stringify(images));
            }    		
    	});*/
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