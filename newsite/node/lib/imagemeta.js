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
    p.writeMetaObjects = function(filepath, images, verbose) {
        //TODO: if several objects are written to file, the JSON is invalid. remove: '][' from file
    	if(verbose)
			console.log("Will append to %s", filepath);
		fs.createWriteStream(filepath, { flags:"a" }).write(JSON.stringify(images));
    	/*
    	fs.exists(filepath, function writeStream (append) {
    		if(verbose)
    			console.log(append ? "TODO: Will append to %s" : "Will write to %s", filepath);
    		fs.createWriteStream(filepath, { flags: append ? "a" : "w" }).write(JSON.stringify(images));
    	});*/
    };
    p.readFolder = function(folder, cb, verbose, filter) {
    	fs.readdir(folder, function fsReadDir(err, files) {
    		var images = [], callCounter = 0;
    		if(err)
    			return cb.call(cb, err);

    		files.forEach(function(file, i, all){
				p.readFile(folder + file, function collectImages(err, image) {
					if(err)
    					return cb.call(cb, err);

    				if(image)
						images.push(image);
					
					callCounter++;
					
					if(callCounter === all.length)
						cb.call(cb, null, images);
				}, verbose, filter);
    		});
    	});
    };
    p.readFile = function(path, cb, verbose, filter) {
    	var shortpath = /^.+(?=images\/)/,	//TODO: perhaps something a little more generic?
    		imageExtensions = /\.(png|gif|jpg|svg)$/,
    		fileFilter = new RegExp(filter);

    	if(!imageExtensions.test(path) || filter && !fileFilter.test(path)) {
    		if(verbose)
    			console.log('Skipping '+path);
    		return cb(null, null);
    	}

    	im.readMetadata(path, function(err, obj) {    		
    		if(err)
    			return cb.call(cb, err);
//console.log("getting %s", path, obj, cb)
			cb.call(cb, null, new meta({
				src: 	path.replace(shortpath, ''),
				width:  obj.exif["exifImageWidth"],
				height: obj.exif["exifImageLength"]
			}));
		});
/*		TODO: look into using rdjpgcom as it seems to be common on unix/linux
		im.identify(path, function(err, obj){
    		if(err)
    			return cb.call(cb, err);

			cb.call(cb, null, new meta({
				src: 	path.replace(shortpath, ''),
				width:  obj.width,
				height: obj.height  
			}));
		});
*/
    };
}