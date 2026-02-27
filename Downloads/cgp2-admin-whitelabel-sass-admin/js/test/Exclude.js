function equalAToB( x, y ) {
// If both x and y are null or undefined and exactly the same
    if ( x === y ) {
        return true;
    }

// If they are not strictly equal, they both need to be Objects
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
        return false;
    }

//They must have the exact same prototype chain,the closest we can do is
//test the constructor.
    if ( x.constructor !== y.constructor ) {
        return false;
    }

    for ( var p in x ) {
        //Inherited properties were tested using x.constructor === y.constructor
        if ( x.hasOwnProperty( p ) ) {
            // Allows comparing x[ p ] and y[ p ] when set to undefined
            if ( ! y.hasOwnProperty( p ) ) {
                return false;
            }

            // If they have the same strict value or identity then they are equal
            if ( x[ p ] === y[ p ] ) {
                continue;
            }

            // Numbers, Strings, Functions, Booleans must be strictly equal
            if ( typeof( x[ p ] ) !== "object" ) {
                return false;
            }

            // Objects and Arrays must be tested recursively
            if ( ! Object.equals( x[ p ], y[ p ] ) ) {
                return false;
            }
        }
    }

    for ( p in y ) {
        // allows x[ p ] to be set to undefined
        if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
            return false;
        }
    }
    return true;
}

var a = [{a: 'a1',b: 'b1',c: 'c1'},{a: 'a2',b: 'b1',c: 'c1'},{a: 'a2',b: 'b2',c: 'c1'},{a: 'a1',b: 'b2',c: 'c2'},{a: 'a2',b: 'b2',c: 'c2'}];
var b = [{a: 'a1',b: 'b1',c: 'c1'},{a: 'a2',b: 'b1',c: 'c1'}];
var c = [];
function remove(a,b){
    var d = a;
    Ext.Array.each(a,function(item1,index1){
        Ext.Array.each(b,function(item2,index2){
            if(equalAToB(item1,item2)){
                Ext.Array.splice(a,index1,1);
                Ext.Array.splice(b,index1,1);
                remove(a,b);
            }
        })
    });
}
remove(a,b);
console.log(a);

