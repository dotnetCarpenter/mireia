#!/usr/bin/env node

/**
 * Image Meta Command line inferface
 * @version 12.12.1
 */
var program = require("commander"),
	im = require("./lib/imagemeta"),
	fs = require("fs"),
	hasDestination = /.+\.json$/,
	destination;

version(function kickoff(success, v) {
	if(success) {
		program
			.version(v)
			.usage('[options] <folder ...> | <file ...> <destination.json>')	
			.option('-v, --verbose', 'output process information - error messages will always be output')
			.option('-f, --filter', 'filter image files')
			.parse(process.argv);

		if(program.args.length === 0)
			program.help();

		if( hasDestination.test(program.args.slice(-1)[0]) )
			destination = program.args.slice(-1)[0];

		program.args.forEach(function(argument, i, all) {
			if(destination && i === all.length-1)	// skip the last arg if it's a destination
				return;

			fs.stat(argument, function folderOrFile(err, stat) {
				if(err) {
					log(err);
					return;
				}

				if(stat.isFile()) {
					im.readFile(argument, imageHandler, program.verbose)
				} else if(stat.isDirectory()) {
					im.readFolder(argument, imageHandler, program.verbose);	
				}
			});			
		});
		//log(' args: %j', program.args);
	} else {
		log("Error: can not read file package.json.\nTERMINATING!")
		process.stdin.destroy();
		return;
	}	
});

function imageHandler (err, images) {
	var l = images.length || 1, s = images.length ? "s" : "";
	if(err)
		log(err);
	if(program.verbose)
		log("Got meta data from %d file%s.", l, s);
	if(destination) {
		im.writeMetaObjects(destination, images, program.verbose);
		if(program.verbose)
			log("Wrote %d file%s to %s.", l, s, destination);
	} else {
		log(images);
	}
}

function version (cb) {
	var path = __dirname + "/package.json",
		version = /version(?:"|'):(?:\s|)(?:"|')(.+)(?:"|'),/;
	fs.readFile(path, "utf-8", function(err, content) {
		if(err) {
			log(err);
			cb.call(cb, false, err);
		} else {
			try {
				cb.call(cb, true, content.match(version)[1]);
			} catch(err) {
				log(err);
				cb.call(cb, err);
			}
		}
	});
}
function log (msg) {
	log.subs = log.subs || /\%s|%j|%d/g;
	if( log.subs.test(msg) ) {
		console.log.apply(
			console,[].splice.call(
				arguments,
				0,
				msg.match(log.subs).length + 1
			)
		);
		if( log.subs.test(arguments[0]) ) {
			log(arguments);
		}
	}
	for (var i = 0, len = arguments.length; i < len; ++i) {
		if( typeof arguments[i] === 'object' ) {
			console.dir(arguments[i]);
		} else {
			console.log(arguments[i]);
		}
	}	
}