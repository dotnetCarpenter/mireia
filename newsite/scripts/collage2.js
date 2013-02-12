/**
 * @version 13.01.01
 */
"use strict"
// collection of image meta information
var collageImages = {
	  main : [{"src":"images/mainfotos/col1.1.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col2.1.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col3.1.jpg","width":1626,"height":1125},{"src":"images/mainfotos/col5.1.jpg","width":1582,"height":1134},{"src":"images/mainfotos/col6.1.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col4.1.jpg","width":850,"height":1276},{"src":"images/mainfotos/unik2.jpg","width":831,"height":1247},{"src":"images/mainfotos/col7.1.jpg","width":1304,"height":1134},{"src":"images/mainfotos/col8.1.jpg","width":1701,"height":978},{"src":"images/mainfotos/unik1.jpg","width":1469,"height":1128},{"src":"images/mainfotos/unik3.jpg","width":1701,"height":1134}]
	, col1 : [{"src":"images/mainfotos/col1.1.jpg","width":1701,"height":1134},{"src":"images/subfotos/col1.2.jpg","width":1701,"height":1134},{"src":"images/subfotos/col1.5.jpg","width":1701,"height":1134},{"src":"images/subfotos/col1.3.jpg","width":1701,"height":1134},{"src":"images/subfotos/col1.4.jpg","width":1701,"height":1134}]
	, col2 : [{"src":"images/mainfotos/col2.1.jpg","width":1701,"height":1134},{"src":"images/subfotos/col2.3.jpg","width":1701,"height":1134},{"src":"images/subfotos/col2.2.jpg","width":1701,"height":1134}]
	, col3 : [{"src":"images/subfotos/col3.2.jpg","width":1107,"height":1701},{"src":"images/subfotos/col3.4.jpg","width":1701,"height":1134},{"src":"images/subfotos/col3.3.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col3.1.jpg","width":1626,"height":1125}]
	, col4 : [{"src":"images/mainfotos/col4.1.jpg","width":850,"height":1276},{"src":"images/subfotos/col4.2.jpg","width":1128,"height":1458},{"src":"images/subfotos/col4.4.jpg","width":1678,"height":1130},{"src":"images/subfotos/col4.3.jpg","width":1701,"height":1134}]
	, col5 : [{"src":"images/mainfotos/col5.1.jpg","width":1582,"height":1134},{"src":"images/subfotos/col5.3.jpg","width":4984,"height":3936},{"src":"images/subfotos/col5.2.jpg","width":5360,"height":3936}]
	, col6 : [{"src":"images/subfotos/col6.2.jpg","width":1134,"height":1701},{"src":"images/subfotos/col6.3.jpg","width":1701,"height":1134},{"src":"images/mainfotos/col6.1.jpg","width":1701,"height":1134}]
	, col7 : [{"src":"images/mainfotos/col7.1.jpg","width":1304,"height":1134},{"src":"images/subfotos/col7.2.jpg","width":1478,"height":1132},{"src":"images/subfotos/col7.3.jpg","width":1134,"height":1701}]
	, col8 : [{"src":"images/subfotos/col8.2.jpg","width":1603,"height":870},{"src":"images/subfotos/col8.3.jpg","width":1607,"height":926},{"src":"images/mainfotos/col8.1.jpg","width":1701,"height":978}]
	, unik1 :[{"src":"images/mainfotos/unik1.jpg","width":1469,"height":1128}]
	, unik2 :[{"src":"images/mainfotos/unik2.jpg","width":831,"height":1247}]
	, unik3 :[{"src":"images/mainfotos/unik3.jpg","width":1701,"height":1134}]
}

var defaultConfiguration = {
//	id: 			'main'
    debug: 			false
  , scrollbarWidth: 0
  , images: 		null
  , margin: 		null
  , canvas: 		null
  , population:		20
}

var collageFunctions, cf = collageFunctions = {
	argGuard: function argumentsGuard(fn, guard) {
		return function (conf, isclass) {
			var missingArgument;
			if(guard instanceof Function)
				missingArgument = guard.call(guard, conf) // the guard is a function
			else if(guard instanceof Object) {
				cf.objectToArray(guard).some(function(propertyvalue, i, all) {
					if( conf[ Object.keys(guard)[i] ] === propertyvalue ) {
						missingArgument = i;
						return true;
					}
				});				
			}
			else
				missingArgument = cf.objectToArray(conf).indexOf(guard); // we're guading against a value
			if(missingArgument >= 0)
				throw "Missing value for argument: " + (Object.keys(conf)[missingArgument] || "That was not provided");
			return isclass ? new fn(conf) : fn(conf);
		}
	},

	memoize: function memoize( fn ) {  
	    return function () {  
	        var args = Array.prototype.slice.call(arguments),  
	            hash = "",  
	            i = args.length,
	        	currentArg = null;  
	        while (i--) {  
	            currentArg = args[i];  
	            hash += (currentArg === Object(currentArg)) ?  
	            JSON.stringify(currentArg) : currentArg;  
	            fn.memoize || (fn.memoize = {});  
	        }  
	        return (hash in fn.memoize) ? fn.memoize[hash] : fn.memoize[hash] = fn.apply(this, args);  
	    };  
	},

	mlt: function multiply(a, b){ return a * b; },

	area: function imageArea(img1, img2) {
        return (Array.isArray(img1) ? img1.reduce(p.mlt) : img1) + img2.reduce(p.mlt);
    },

    resize: function resizeToCanvas(img, i, all) {
        all[i][0] = img[0] * this.factor;
        all[i][1] = img[1] * this.factor;
    },

	empty: function empty(obj) {
		//TODO: what about boolean objects?
		var emptyValues = [undefined, null, false, 0, "", "0"];
		return emptyValues.indexOf(obj) > 0 || Object.keys(obj).length === 0;
	},

	fst: function first(list) {                
	    return Array.isArray(list) ? list[0] : cf.objectTo(list, cf.toValues)[0];
	},

	snd: function second(list) {
	    return Array.isArray(list) ? list[1] : cf.objectTo(list, cf.toValues)[1];
	},

	pos: function position(list, pos) {
		return list[pos];
	},

	lst: function last(list) {
		if(cf.empty(list))	// avoid infinite loop
			return;
		return list.length ? list[list.length-1] : last( cf.objectTo(list, cf.toValues) );
	},

	toIndexes: function toIndexes(v, i) {
		return i;
	},

	toValues: function toValues(v) {
		return this[v];
	},

	objectTo: function objectTo(obj, iterator) {
		return Object.keys(obj).map(iterator, obj);
	},
	// takes an array and return a new array with just the indexes of the former
	indexOrder: function imageOrder(list) {
		return list.map(collageFunctions.toIndexes);
	},

	clone: function clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	},

	objectToArray: function objectToArray(obj) {
		return cf.objectTo( obj, cf.toValues);
	},

	/**
	 * Randomize array element order in-place.
	 * Using Fisher-Yates shuffle algorithm.
	 */
	shuffle: function shuffleArray(array) {
	    var j, temp;
	    for (var i = array.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    };
	    return array;
	},

	rnd: function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

var binPackings = {
	"shelfNF"	: 1
  , "shelfFF"	: 2
  , "shelfBFW"	: 4
  , "GUILLOTINE": 8 // packing lightmaps
}


function Canvas(conf) {
    this.factor = conf.factor || 0.0;
    this.scene = conf.scene;
    this.area = conf.area || /* if area is not provided we assume the Element interface */
    						 new Rect(0, 0, this.scene.scrollWidth, this.scene.scrollHeight);
};

function solution(chromosome) {
	/**
	 * dna = image order + protein + type
	 * protein could be bufferThreshold in collage.js
	 * type = different type of bin-packing algorithms
	 * fitness = TODO
	 */
	var geneOrder = chromosome.genes.join(''),
		geneProtein = chromosome.protein,
		geneType = chromosome.type;
	this.dna = geneOrder + geneProtein + geneType;
}

function Chromosome(rectangles) {
	this.genes = rectangles;
	this.type = cf.fst( cf.shuffle( cf.objectTo( binPackings, cf.toValues) ) );
	this.protein = 100;
}
Chromosome.prototype.genes;
Chromosome.prototype.type = cf.fst( cf.objectTo( binPackings, cf.toValues) );
Chromosome.prototype.protein = 100;


function Population(conf) {
	console.dir(conf.canvas)
	var chromosomes = [];
	while(conf.population--) {
		chromosomes.push( new GUILLOTINE() );
		
	}
	chromosomes.forEach(function run(c) {
		c(conf.images, conf.canvas);
	});
}

// TEST
//cf.objectTo = cf.memoize(cf.objectTo);
console.dir(
	new solution(
		new Chromosome(
			cf.shuffle(
				cf.indexOrder(
					cf.fst(collageImages)
				)
			)
		)
	)
)
/// END TEST

function setup() {
	var guardedCanvas = cf.argGuard(Canvas, { scene: undefined });
	var guardedPopulation = cf.argGuard(Population, null);
	var canvas = new guardedCanvas({
		scene: document.getElementById('canvas1')
	}, true);

	var conf = cf.clone(defaultConfiguration);
	conf.images = cf.fst(collageImages);
	conf.canvas = canvas;
	conf.margin = 10;

	var p2 = new guardedPopulation(conf, true);
	//console.dir(p2)
}
function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function GUILLOTINE() {
	
	
	Rect.prototype.fits_in = function(outer) {
	    return outer.w >= this.w && outer.h >= this.h;
	}
	Rect.prototype.same_size_as = function(other) {
	    return this.w == other.w && this.h == other.h;
	}

	function Bin() {
		this.left = null;
	    this.right = null;
	    this.rect = null;
	    this.filled = false;
	}
	Bin.prototype.insert_rect = function(rect) {
		if(this.left != null)
            return this.left.insert_rect(rect) || this.right.insert_rect(rect);

        if(this.filled)
            return null;

        if(!rect.fits_in(this.rect))
            return null;

        if(rect.same_size_as(this.rect))
        {
            this.filled = true;
            return this;
        }

        this.left = new Node();
        this.right = new Node();

        var width_diff = this.rect.w - rect.w;
        var height_diff = this.rect.h - rect.h;

        var me = this.rect;

        if(width_diff > height_diff)
        {
            // split literally into left and right, putting the rect on the left.
            this.left.rect = new Rect(me.x, me.y, rect.w, me.h);
            this.right.rect = new Rect(me.x + rect.w, me.y, me.w - rect.w, me.h);
        }
        else
        {
            // split into top and bottom, putting rect on top.
            this.left.rect = new Rect(me.x, me.y, me.w, rect.h);
            this.right.rect = new Rect(me.x, me.y + rect.h, me.w, me.h - rect.h);
        }

        return this.left.insert_rect(rect);
	};

	return function lightmaps(rectangles, canvas) {
		var node = new Bin();
		var placedRectangles = [];
		node.rect = new Rect(0, 0, canvas.area.w, canvas.area.h);
		rectangles.forEach(function (img) {
			var rect = new Rect(0, 0, img.width, img.height);
			var success = node.insert_rect(rect);
			placedRectangles.push(success && success.rect || null);
		});
	}
}




/**
 * Feature detect common.js 
 */
if(typeof module !== 'undefined' && module.exports) {
    module.exports;//TODO: TBD
}
