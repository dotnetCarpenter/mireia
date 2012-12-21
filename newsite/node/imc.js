#!/usr/bin/env node

/**
 * Image Meta Command line inferface
 * @version 12.12.15.1
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
			.usage('[options] <folder ...> <file ...> [<destination.json>]\n\t NOTE: Does not support animated gif')			
			.option('-p. --prefix <prefix>', 'prefix the src in the output JSON - the first argument after -p must be the <prefix>\n\t\t\t   Example: -p "../assets/images/highres"')
			.option('-f, --filter <filter>', 'filter image files - the first argument after -f must be the <filter>\n\t\t\t   Example: -f "image\\d{2}"')
			.option('-v, --verbose', 'output process information - error messages will always be output')
			.parse(process.argv);

		if(program.args.length === 0)
			program.help();

/*log(' args: %j', program.args);
log(' args: %j', program.prefix);
log(' args: %j', program.filter);
log(' args: %j', program.verbose);*/

		if( hasDestination.test(program.args.slice(-1)[0]) )
			destination = program.args.splice(-1)[0];

		program.args.forEach(function(argument, i, all) {
			fs.stat(argument, function folderOrFile(err, stat) {
				if(err) {
					log(err);
					return;
				}
				//console.log(argument, program.prefix);

				if(stat.isFile()) {
					im.readFile(argument, imageHandler, { verbose: program.verbose, filter: program.filter, prefix: program.prefix });
				} else if(stat.isDirectory()) {
					im.readFolder(argument, imageHandler, { verbose: program.verbose,filter: program.filter, prefix: program.prefix });	
				}
			});			
		});
		
	} else {
		log("Error: can not read file package.json.\nTERMINATING!")
		process.stdin.destroy();
		return;
	}	
});

function imageHandler (err, images) {
	if(err)
		log(err);

	if(!images || images.length < 1) {
		log("Didn't find any images that match your criteria.");
		return;
	}

	var l = images.length || 1, s = images.length ? "s" : "";
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
	fs.readFile(path, "utf8", function(err, content) {
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