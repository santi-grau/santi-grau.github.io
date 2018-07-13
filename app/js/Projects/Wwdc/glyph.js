var Glyph = function( letter ){
	this.data = letter;
	for( var i = 0 ; i < this.data.length ; i++ ) this.parseWeight( this.data[ i ].regular );
	for( var i = 0 ; i < this.data.length ; i++ ) this.parseWeight( this.data[ i ].italic );
}
Glyph.prototype.parseWeight = function( weight ){
	if ( typeof weight.metrics == 'string' ) weight.metrics = this.parseMetrics( weight.metrics ); // left position, bottom offset, width + left position, height + bottom offset
	if ( typeof weight.path == 'string' ) weight.path = ( /[a-zA-Z]/.test( weight.path ) ) ? this.parsePath( weight.path, weight.metrics ) : this.parsePolyline( weight.path, weight.metrics );
}
Glyph.prototype.parseMetrics = function( metrics ){
	var ms = metrics.split( ' ' );
	var vals = [];
	for( var i = 1 ; i < ms.length ; i++ ){
		vals.push( parseFloat( ms[ i ] ) );
	}
	return vals;
}
Glyph.prototype.parsePolyline = function( path, metrics ){
	var vertices = [ ];
	var points = path.split( ' ' );
	var minx = 10000000000;
	var maxx = -10000000000;
	var miny = 10000000000;
	var maxy = -10000000000;
	for( var i = 0 ; i < points.length ; i++ ){
		var coords = points[ i ].split( ',' );
		if( parseFloat( coords[0] ) > maxx ) maxx = parseFloat( coords[0] );
		if( parseFloat( coords[0] ) < minx ) minx = parseFloat( coords[0] );
		if( parseFloat( coords[1] ) > maxy ) maxy = parseFloat( coords[1] );
		if( parseFloat( coords[1] ) < miny ) miny = parseFloat( coords[1] );
	}
	var width = maxx - minx;
	var height = maxy - miny;

	for( var i = 0 ; i < points.length ; i++ ){
		var coords = points[ i ].split( ',' );
		vertices.push( {
			vertex : [ parseFloat( coords[ 0 ] ) - minx + metrics[0], - parseFloat( coords[ 1 ] ) + miny - metrics[1] + height ],
			handles : [ [null,null], [null,null] ]
		});
	}
	// console.log( minx, maxx, miny, maxy, width, height );
	return vertices;
}
Glyph.prototype.parsePath = function( path, metrics ){
	var vertices = [ ];
	var minx = 10000000000;
	var maxx = -10000000000;
	var miny = 10000000000;
	var maxy = -10000000000;
	var segments = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg"><path id="svgpath" d="' + path + '" /></svg>', "application/xml").querySelector('svg').getElementById('svgpath').getPathData();
	var prevCoord = [];
	for ( var i = 0 ; i < segments.length ; i++ ) {
		
		if( segments[ i ].type == 'm' ) coords = [ prevCoord[0] + segments[ i ].values[0], prevCoord[1] + prevCoord[1] ];
		if( segments[ i ].type == 'M' ) coords = [ segments[ i ].values[0], segments[ i ].values[1] ];
		if( segments[ i ].type == 'h' ) coords = [ prevCoord[0] + segments[ i ].values[0], prevCoord[1] ];
		if( segments[ i ].type == 'H' ) coords = [ segments[ i ].values[0], prevCoord[1] ];
		if( segments[ i ].type == 'v' ) coords = [ segments[ i ].values[0], prevCoord[1] + segments[ i ].values[1] ];
		if( segments[ i ].type == 'V' ) coords = [ prevCoord[0], segments[ i ].values[1] ];
		if( segments[ i ].type == 'c' ) coords = [ prevCoord[0] + segments[ i ].values[4], prevCoord[1] + segments[ i ].values[5] ];
		if( segments[ i ].type == 'C' ) coords = [ segments[ i ].values[4], segments[ i ].values[5] ];
		if( segments[ i ].type == 's' ) coords = [ prevCoord[0] + segments[ i ].values[2], prevCoord[1] + segments[ i ].values[3] ];
		if( segments[ i ].type == 'S' ) coords = [ segments[ i ].values[2], segments[ i ].values[3] ];
		if( segments[ i ].type == 'l' ) coords = [ prevCoord[0] + segments[ i ].values[2], prevCoord[1] + segments[ i ].values[3] ];
		if( segments[ i ].type == 'L' ) coords = [ segments[ i ].values[0], segments[ i ].values[1] ];

		if( parseFloat( coords[0] ) > maxx ) maxx = parseFloat( coords[0] );
		if( parseFloat( coords[0] ) < minx ) minx = parseFloat( coords[0] );
		if( parseFloat( coords[1] ) > maxy ) maxy = parseFloat( coords[1] );
		if( parseFloat( coords[1] ) < miny ) miny = parseFloat( coords[1] );

		prevCoord = coords;
	};
	var width = maxx - minx;
	var height = maxy - miny;

	for( var i = 0 ; i < segments.length ; i++ ){
		if( segments[ i ].type == 'm' ) coords = [ prevCoord[0] + segments[ i ].values[0], prevCoord[1] + prevCoord[1] ];
		if( segments[ i ].type == 'M' ) coords = [ segments[ i ].values[0], segments[ i ].values[1] ];
		if( segments[ i ].type == 'h' ) coords = [ prevCoord[0] + segments[ i ].values[0], prevCoord[1] ];
		if( segments[ i ].type == 'H' ) coords = [ segments[ i ].values[0], prevCoord[1] ];
		if( segments[ i ].type == 'v' ) coords = [ segments[ i ].values[0], prevCoord[1] + segments[ i ].values[1] ];
		if( segments[ i ].type == 'V' ) coords = [ prevCoord[0], segments[ i ].values[1] ];
		if( segments[ i ].type == 'l' ) coords = [ prevCoord[0] + segments[ i ].values[2], prevCoord[1] + segments[ i ].values[3] ];
		if( segments[ i ].type == 'L' ) coords = [ segments[ i ].values[0], segments[ i ].values[1] ];
		if( segments[ i ].type == 'c' ) coords = [ prevCoord[0] + segments[ i ].values[4], prevCoord[1] + segments[ i ].values[5] ];
		if( segments[ i ].type == 'C' ) coords = [ segments[ i ].values[4], segments[ i ].values[5] ];
		if( segments[ i ].type == 's' ) coords = [ prevCoord[0] + segments[ i ].values[2], prevCoord[1] + segments[ i ].values[3] ];
		if( segments[ i ].type == 'S' ) coords = [ segments[ i ].values[2], segments[ i ].values[3] ];

		vertices.push( {
			vertex : [ coords[ 0 ] - minx + metrics[0], coords[ 1 ] - miny + metrics[1] ],
			handles : [ [null,null], [null,null] ]
		});

		prevCoord = coords;
	}

	for( var i = 0 ; i < segments.length ; i++ ){
		
		if( segments[ i ].type == 'c' ){
			vertices[ i - 1 ].handles[ 1 ] = [ vertices[ i - 1 ].vertex[ 0 ] + segments[ i ].values[0], vertices[ i - 1 ].vertex[ 1 ] + segments[ i ].values[1] ];
			vertices[ i ].handles[ 0 ] = [ vertices[ i - 1 ].vertex[ 0 ] + segments[ i ].values[2], vertices[ i - 1 ].vertex[ 1 ] + segments[ i ].values[3] ];
		}
		if( segments[ i ].type == 'C' ){
			vertices[ i - 1 ].handles[ 1 ] = [ segments[ i ].values[0] - minx + metrics[0], segments[ i ].values[1] - miny + metrics[1] ];
			vertices[ i ].handles[ 0 ] = [ segments[ i ].values[2] - minx + metrics[0], segments[ i ].values[3] - miny + metrics[1] ];
		}
		if( segments[ i ].type == 's' ){
			vertices[ i - 1 ].handles[ 1 ] = [ vertices[ i - 1 ].vertex[ 0 ] - Math.abs( vertices[ i - 1 ].handles[ 0 ][ 0 ] - vertices[ i - 1 ].vertex[ 0 ] ), vertices[ i - 1 ].vertex[ 1 ] - Math.abs( vertices[ i - 1 ].handles[ 0 ][ 1 ] - vertices[ i - 1 ].vertex[ 1 ] ) ];
			vertices[ i ].handles[ 0 ] = [ vertices[ i - 1 ].vertex[ 0 ] + segments[ i ].values[0], vertices[ i - 1 ].vertex[ 1 ] + segments[ i ].values[1] ];
		}
		if( segments[ i ].type == 'S' ){
			vertices[ i - 1 ].handles[ 1 ] = [ vertices[ i - 1 ].vertex[ 0 ] - Math.abs( vertices[ i - 1 ].handles[ 0 ][ 0 ] - vertices[ i - 1 ].vertex[ 0 ] ), vertices[ i - 1 ].vertex[ 1 ] + Math.abs( vertices[ i - 1 ].handles[ 0 ][ 1 ] - vertices[ i - 1 ].vertex[ 1 ] ) ];
			vertices[ i ].handles[ 0 ] = [ segments[ i ].values[0] - minx + metrics[0], segments[ i ].values[1] - miny + metrics[1] ];
		}

		prevCoord = coords;
	}

	return vertices;
}

module.exports = Glyph;