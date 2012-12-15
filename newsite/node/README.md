# imagemeta-cli

Image Meta Command Line Interface - Get image meta data like width and height as JSON

## Getting Started
Install the module with: `npm install imagemeta-cli`

```bash
Usage: ./imc.js [options] <folder ...> <file ...> <destination.json>
	 NOTE: Does not support animated gif

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --filter <filter>  filter image files - the first argument after -f must be the <filter>
    			   Example: -f "image\d{2}"
    -p. --prefix <prefix>  prefix the src in the output JSON - the first argument after -f must be the <prefix>
    			   Example: -p "../assets/images/highres"
    -v, --verbose          output process information - error messages will always be output
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
+ 0.1.1 Fixed out JSON when writing from multiple sources, E.I. different folders and files. Added prefix path to output JSON ```src`` property. Support for jpg, tiff, png and gif.
+ 0.1.0 Initial Release - only support for jpg

## License
Copyright (c) 2012 dotnetCarpenter  
Licensed under the MIT license.
