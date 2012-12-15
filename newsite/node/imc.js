#!/usr/bin/env node

/**
 * Image Meta Command line inferface
 * @version 12.12.1
 */
var program = require("commander"),
	im = require("./lib/imagemeta"),
	root = process.cwd(),
	fs = require("fs");

version(function kickoff(success, v) {
	if(success) {
		program
			.version(v)
			.usage('<folder ...> | <file ...>')			
			.parse(process.argv);

		if(program.args.length === 0)
			program.help();

		program.args.forEach(function(folder) {
			im.readFolder(folder, function(images) {
				log(images);
			});
		});

		log(' args: %j', program.args);

		process.stdin.destroy();
	} else {
		log("Error: can not read file package.json.\nTERMINATING!")
		process.stdin.destroy();
		return;
	}	
});

function version (cb) {
	var path = root + "/package.json",
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