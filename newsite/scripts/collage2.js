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
	id: 			'main'
  , debug: 			false
  , scrollbarWidth: 0
  , images: 		null
  , factor: 		null
  , margin: 		null
  , canvas: 		null
  , area: 			null
  , population:		20
}

var collageFunctions = {
	empty: function empty(o) {
		//TODO: what about boolean objects?
		var emptyValues = [undefined, null, false, 0, "", "0"];
		return emptyValues.indexOf(o) > 0 || Object.keys(o).length === 0;
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
		//return Object.keys(obj);
	},
	// probably not needed
	indexOrder: function imageOrder(list) {
		return list.map(collageFunctions.toIndexes);
	},

	clone: function clone(o) {
		return JSON.parse(JSON.stringify(o));
	},

	/**
	 * Randomize array element order in-place.
	 * Using Fisher-Yates shuffle algorithm.
	 */
	shuffleArray: function shuffleArray(array) {
	    var j, temp;
	    for (var i = array.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    };
	    return array;
	}
}, cf = collageFunctions;

var binPackings = {
	"shelfNF"	: 1
  , "shelfFF"	: 2
  , "shelfBFW"	: 4
}

function solution(chromosome) {
	/**
	 * dna = image order + protein + type
	 * protein could be bufferThreshold in collage.js
	 * type = different type of bin-packing algorithms
	 * fitness TODO:
	 */
	var geneOrder = chromosome.genes.join(''),
		geneProtein = chromosome.protein,
		geneType = chromosome.type;
	this.dna = geneOrder + geneProtein + geneType;
}

function Chromosome(images) {
	this.genes = images;
	this.type = cf.fst( cf.objectTo( binPackings, cf.toValues) );
	this.protein = 100;
}

// TEST
console.dir(
	new solution(
		new Chromosome(
			cf.shuffleArray(
				cf.indexOrder(
					cf.fst(collageImages)
				)
			)
		)
	)
)
var conf = defaultConfiguration;
conf.images = cf.fst(collageImages);
var p = new Population(defaultConfiguration);
console.dir(p)
/// END TEST

function Population(conf) {
	var missingArgument = cf.objectTo( conf, cf.toValues).indexOf(null);
	if(missingArgument >= 0)
		throw "Missing value for argument " + Object.keys(conf)[missingArgument]
	while(conf.population--) {
		
	}
}

/**
 * Feature detect common.js 
 */
if(typeof module !== 'undefined' && module.exports) {
    module.exports;//TODO: TBD
}