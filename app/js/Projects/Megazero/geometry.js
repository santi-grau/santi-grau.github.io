var svgMesh3d = require('svg-mesh-3d');
// var THREE = require('three');

module.exports = function( self ){
	self.addEventListener('message',function (msg){
		var data = JSON.parse( msg.data );
		self.importScripts( data.url + '/scripts/three.min.js' );

		var extrudeSVG = function( path ){
			depth = 1;

			var edgeMargin = 0.0;
			var mesh = svgMesh3d( path, { delaunay : true, clean : true, simplify : 0, scale : 1, normalize : false, randomization : 0 } );

			// get all segments from mesh
			for(var i = 0, lines = [], comparePairs = [[0,1],[1,2],[0,2]] ; i < mesh.cells.length ; i++ ) for( j = 0 ; j < comparePairs.length ; j++ ) lines.push( [ mesh.cells[i][ comparePairs[j][0] ], mesh.cells[i][ comparePairs[j][1] ] ] );

			// get external contour segments
			var contours = [];
			while( lines.length ){
				for( var j = 0, segment = lines.shift(), index = null ; j < contours.length; j++ ){
					if( ( segment[0] == contours[j][0] && segment[1] == contours[j][1] ) || ( segment[1] == contours[j][0] && segment[0] == contours[j][1] ) ){
						index = j;
						break;
					}
				}
				( index == null ) ? contours.push(segment) : contours.splice(index,1);
			}

			// compute segments
			var segments = [];
			var activeSegment = 0;
			while( contours.length > 0 ){
				var index = null;
				if( segments.length < activeSegment + 1 ) segments[activeSegment] = [];
				if( !segments[activeSegment].length ) segments[activeSegment].push( contours.shift() );
				else {
					for( var i = 0 ; i < contours.length ; i++ ){
						if( segments[activeSegment][ segments[activeSegment].length - 1 ][1] == contours[i][0] ) {
							segments[activeSegment].push( [ contours[i][0],contours[i][1] ] );
							contours.splice( i, 1 );
							break;
						}
						if( segments[activeSegment][ segments[activeSegment].length - 1 ][1] == contours[i][1] ) {
							segments[activeSegment].push( [ contours[i][1],contours[i][0] ] );
							contours.splice( i, 1 );
							break;
						}
					}
				}
				if( segments[activeSegment][ segments[activeSegment].length - 1 ][1] == segments[activeSegment][0][0] ) activeSegment++;
			}

			var geometry = new THREE.Geometry();

			for (var i = 0; i < mesh.positions.length; i++) geometry.vertices.push( new THREE.Vector3( mesh.positions[i][0], mesh.positions[i][1], mesh.positions[i][2] ) );
			for (var i = 0; i < mesh.cells.length; i++) geometry.faces.push( new THREE.Face3( mesh.cells[i][0], mesh.cells[i][1], mesh.cells[i][2] ) );

			var str0 = [];
			var str1 = [];
			var str2 = [];
			for( var i = 0 ; i < segments[0].length ; i++ ){
				str0.push( geometry.vertices.push( new THREE.Vector3( mesh.positions[ segments[ 0 ][ i ][ 0 ] ][ 0 ], mesh.positions[ segments[ 0 ][ i ][ 0 ] ][ 1 ], edgeMargin ) ) - 1 );
				str1.push( geometry.vertices.push( new THREE.Vector3( mesh.positions[ segments[ 0 ][ i ][ 0 ] ][ 0 ], mesh.positions[ segments[ 0 ][ i ][ 0 ] ][ 1 ], depth + edgeMargin ) ) - 1 );
			}

			for( var i = 0 ; i < segments[0].length ; i++ ){
				if( i > 0 ) geometry.faces.push( new THREE.Face3( segments[0][i][0], segments[0][i-1][0], str0[i-1] ), new THREE.Face3( str0[i], segments[0][i][0], str0[i-1] ) );
				if( i == segments[0].length - 1 ) geometry.faces.push( new THREE.Face3( str0[0], segments[0][i][0], str0[i] ), new THREE.Face3( segments[0][0][0], segments[0][i][0], str0[0] ) );
			}

			for( var i = 0 ; i < segments[0].length ; i++ ){
				if( i > 0 ) geometry.faces.push( new THREE.Face3( str0[i], str0[i-1], str1[i-1] ), new THREE.Face3( str1[i], str0[i], str1[i-1] ) );
				if( i == segments[0].length - 1 ) geometry.faces.push( new THREE.Face3( str1[0], str0[i], str1[i] ), new THREE.Face3( str0[0], str0[i], str1[0] ) );
			}

			var idxStart = geometry.vertices.length;
			for (var i = 0; i < mesh.positions.length; i++) str2.push( geometry.vertices.push( new THREE.Vector3( mesh.positions[i][0], mesh.positions[i][1], depth + edgeMargin * 2 ) ) - 1 );
			for (var i = 0; i < mesh.cells.length; i++) geometry.faces.push( new THREE.Face3( mesh.cells[i][1] + idxStart, mesh.cells[i][0] + idxStart, mesh.cells[i][2] + idxStart ) );
			
			for( var i = 0 ; i < segments[0].length ; i++ ){
				if( i > 0 ) geometry.faces.push( new THREE.Face3( str1[i], str1[i-1], str2[segments[ 0 ][ i-1 ][ 0 ]] ), new THREE.Face3( str2[segments[ 0 ][ i ][ 0 ]], str1[i], str2[segments[ 0 ][ i - 1 ][ 0 ]] ) );
				if( i == segments[0].length - 1 ) geometry.faces.push( new THREE.Face3( str1[i], str2[segments[ 0 ][ 0 ][ 0 ]], str2[segments[ 0 ][ i ][ 0 ]] ), new THREE.Face3( str1[i], str1[0], str2[segments[ 0 ][ 0 ][ 0 ]] ) );
			}

			geometry.computeBoundingBox();
			var max = geometry.boundingBox.max, min = geometry.boundingBox.min;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			var faces = geometry.faces;

			geometry.faceVertexUvs[0] = [];

			for (var j = 0; j < faces.length ; j++) {
				var v1 = geometry.vertices[faces[j].a], v2 = geometry.vertices[faces[j].b], v3 = geometry.vertices[faces[j].c];
				geometry.faceVertexUvs[0].push([ new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y), new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y), new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y) ]);
			}
			geometry.uvsNeedUpdate = true;

			geometry.computeBoundingSphere();
			// geometry.computeFaceNormals();
			geometry.computeVertexNormals();
			geometry.computeBoundingBox();
			var buffer = new THREE.BufferGeometry().fromGeometry( geometry );

			return geometry;
		}

		var geos = {};

		for (var letter in data.letters ) {

			geos[ letter ] = {}
			for (var path in data.letters[ letter ] ) {
				var g = extrudeSVG( data.letters[ letter ][ path ].path );
				geos[ letter ][ path ] = {
					geo : g,
					props : data.letters[ letter ][ path ].props
				}
			}
		}

		self.postMessage( JSON.stringify( geos ) );
	});
}