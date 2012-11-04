/**
 * Flow example (top down)
 * [x1, y1, x2, y2, Boolean]
 * __________
 * |        |
 * |        |
 * |        |
 * |________|
 * [0, 0, 941, 519, 0]
 * __________
 * |__|_____| [0, 0, 340, 244, urlId]
 * |  |     |
 * |  |     |
 * |__|_____|
 * [  0,   0, 340, 244, 1] // column1
 * [  0, 244, 340, 519, 0] // column1
 * [340,   0, 941, 244, 0] // column2
 * [340, 244, 941, 519, 0] // column2
 * __________
 * |__|_____| [0,   0, 340, 244, urlId]
 * |_||_____| [0, 244, 280, 488, urlId]
 * | ||     |
 * |_||_____|
 * [  0,   0, 340, 244, 1] // column1
 * [  0, 244, 280, 488, 1] // column1
 * [  0, 244, 280, 519, 0] // column1
 * [280, 244, 340, 488, 0] // column2
 * [280, 488, 340, 519, 0] // column2
 * [340,   0, 941, 244, 0] // column3
 * [340, 244, 941, 488, 0] // column3
 * [340, 488, 941, 519, 0] // column3
 * ect.
 */

var ns = ns || {};  // namespace
// meta data for the images
ns.imagesMeta = [{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_1691bis.jpg","height":1134,"width":1582},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_0816bis2.jpg","height":1134,"width":1304},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_1342bis.jpg","height":1125,"width":1626},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_1515.jpg","height":1134,"width":1701},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_0710bis.jpg","height":1247,"width":831},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_1057bis.jpg","height":1276,"width":850},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_0913.jpg","height":1134,"width":1701},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_1600.jpg","height":1134,"width":1701},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_0450.jpg","height":978,"width":1701},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_1185.jpg","height":1134,"width":1701},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_0145.jpg","height":1128,"width":1469},{"src":"https://c9.io/dotnetcarpenter/mireia/workspace/newsite/images/mainfotos/IMG_1417.jpg","height":1134,"width":1701}];
if(!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, context) {
        for(var i = 0, len = this.length; i < len; ++i) {
          fn.call(context, this[i], i, this);
        }
    };
}
if(!Array.prototype.map) {
    Array.prototype.map = function(callback, context) {
        var i = 0, len = this.length >>> 0, map = [];
        while(i < len) {
            if(this[i]) {   // beware that 0 is falsy
                map.push(callback.call(context, this[i], i, this));
            }
            ++i;
        }
        return map;
    };
}
// TODO: implement reduce for IE
// TODO: implement Object.keys for IE
// TODO: implement Array.isArray for IE
// TODO: implement Array.some for IE

ns.Canvas = function() {
    this.factor = 0.0;
    this.currentSlot = 0;   // not used
    this.scene = $('.content');
    this.area = [[0, 0, this.scene.width(), $(window).height(), 0]]; /* 0 === false */                
};
ns.canvas = new ns.Canvas();

/**
 * Creates a two dimensional array from an object
 * @param {Object} hashtable
 * @return {Array} list
 */
/*ns.list = function(hashtable) {
    return Object.keys(hashtable).map(function(el, i) {
        var list=new Array(2); list[0]=el; list[1]=hashtable[el];
        return list;
    })
};*/
/*ns.depthFirstTraverse = function(parent, fn) {
    if(parent.children) {
        for(var i = 0, len = parent.children.length; i < len; ++i) {            
            fn(parent.children[i], i, parent.children, parent);
            depthFirstTraverse(parent.children[i], fn);
        }
    }
}*/

ns.fst = function(list) {                
    return list[0];
}
ns.snd = function(list) {
    return list[1];
}
//ns.first.depth = 0;
ns.sum = function(a,b){ return a+b; };
ns.imageArea = function(img1, img2) {
    return (Array.isArray(img1) ? img1.reduce(ns.sum) : img1) + img2.reduce(ns.sum);
}
ns.resize = function(img, i , all) {
    all[i][2] = img[2] * this.factor;
    all[i][3] = img[3] * this.factor;
}
/**
 * Deep-First indexOf for objects and arrays
 *
ns.indexOf = function(search) {
    var index = 0, itCount = 0;
    for (var prop in this) {
		if(typeof this[prop] === 'object') {
            if(ns.indexOf.call(this[prop], search) <= 0) {
                return index;
            }
			if(index === -1) {
				return -1;	// not found
			}
		} else if(search === this) {
            return index;
        } else if(search[prop] === this[prop]) {
            for (;index = ns.indexOf.call(this[++itCount], search[itCount]), index !== -1;);/* { 
                return index;
            }
            if(index === -1) {
				return -1;	// not found
			}
		}
        ++index;
	}
    if(search !== this.valueOf()) {
        return -1;  // not found
    }
	return index;	// found
}*/
/* ORIGINAL
function breadthFirstTraverse(parent, fn) {
    var queue = [], result;      
    while(parent) {
        if(parent.children) {
            for(var i = 0, len = parent.children.length; i < len; ++i) {
                result = fn(parent.children[i], i, parent.children, parent);
                if(result) { return result; }   // if fn has a return value then we'll return that value and end traversing
                queue.push(parent.children[i]);
            }
        }
        parent = queue.shift();
    }
}*/
ns.breadthFirstTraverse = function breadthFirstTraverse(root, fn, context){
    var queue = [], result, counter = 0;
    while (root) {
        for(var child in root) {
            result = fn.call(context, root[child], counter++, root);
            if(result) { return result; }   // if fn has a return value then we'll return that value and end traversing
            if(typeof root[child] === 'object') {   // doesn't work String is also an object
                queue.push(root[child]);
            }
        }
        root = queue.shift();
        counter = 0;
    }
}

ns.indexOf = function indexOf(search) {
    /*    
    var index;
    for(var prop in search) {   // no optimization
        index = ns.breadthFirstTraverse(this, sfn);
        if(index >= 0) {
            return index;
        }
    }
    return -1;
    function sfn(subject, i, all) {    // search function
        if( i %  search.length)
        console.log(search[prop] || prop);
        if( (search[prop] || prop) == subject ) {  // test for 0 eval to false if we use the strict comparison ===
            return index;
        }
    }*/
    /*var index = -1;
    for(var i = 0, len = this.length; i < len; ++i) {        
        ns.breadthFirstTraverse(this[i], function(subject) {
            if(search[i] === subject) {
                index = i;
                if(i === search.length) {
                    return true;
                }
            } else {
                return -1;
            }
        });
    }
    return index;*/
    var slen = search.length, matchresult = new Array(slen);
    function found(t) {
        return t;
    };
    
    for (var j = 0, len = this.length; j < len; ++j) {
        for (var i = 0; i < slen; ++i) {
            matchresult[i] = search[i] === this[j][i];
        }
        if(matchresult.every(found)) {
            return j;
        }
    }
    return -1;
};
ns.debug = function(newslot, iteration, slots) {
    //console.log(JSON.stringify(newslot));
    var newSlotPosition = ns.indexOf.call(slots, newslot.slice(0, 3)) // the last item is an id to an URL
      , p = ['[ ', ' ]', ' // new!'];
    console.log("Iteration: #", iteration);
    slots.forEach(function(slot, i) {
        console.log(i === newSlotPosition ? p[0]+slot.toString()+p[1]+p[2] : p[0]+slot.toString()+p[1]);
    });
}
ns.placeImage = function(img, i, all) {
    if(i > 1) { /*console.log(i);*/ return; }
    
    //console.dir(this);
    // find next free space
    var free, availableSpace = 0;
    this.area.some(function(space, slotnumber) {
        if(!space[4]) {
            // test if there is enough room
            availableSpace += (space[2]-space[0]) * (space[3]-space[1]);                        
            if( availableSpace >= img[2] * img[3] ) {
                free = space;
                this.currentSlot = slotnumber;
                return;
            } else {                            
                free = free.concat(space);
            }
            
        }
    }, this);
    // which row?
    this.area.splice(i, 0,
        [ free[0], free[1],  img[2],  img[3], 1] // insert new occupied slot (1 === true)
      , [ free[0],  img[3],  img[2], free[3], 0]
      , [  img[2], free[1], free[3],  img[2], 0]
    );
    free[0] = img[2], free[1] = img[3]; // right bottom slot
    //this.area.unshift([ free[0], free[1], img[2], img[3], 1 ]); // insert new occupied slot (1 === true)
    ns.debug(img, i+1, this.area);
//     console.log("New slot: ", img);
//     console.dir(this.area);
}
ns.createImages = function(images, uris) {
    var self = this;
    images.forEach(function(img, i, all) {
        self.scene;
    });
}