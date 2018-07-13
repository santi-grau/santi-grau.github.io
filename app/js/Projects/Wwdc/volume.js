var Glyph = require('./glyph');
var data = require('./data.json');
var SimplexNoise = require('simplex-noise');

var Volume = function( ){
	this.letter = new Glyph( data.W );
	this.weight = 0;
	this.italic = 0;
	this.time = 0;
	this.timeInc = 0.001;
	this.geometry = new THREE.Geometry();

	this.simplex = new SimplexNoise(Math.random);

	this.vPositions = [];

	for( var i = 0 ; i < this.letter.data[0].regular.path.length - 1; i++ ){
		var fs = [1,2,8,2,7,8,7,2,3,7,3,6,6,3,5,3,4,5,1,8,9,0,1,9,0,9,15,15,9,10,15,10,11,14,15,11,14,11,12,14,12,13];
		var vs = this.letter.data[0].regular.path[i].vertex;
		this.geometry.vertices.push( new THREE.Vector3( vs[0], vs[1], 0 ) );
		this.vPositions.push(new THREE.Vector3( vs[0], vs[1], 0 ))
		for( var j = 0 ; j < fs.length ; j += 3 )  this.geometry.faces.push( new THREE.Face3( fs[ j ], fs[ j + 1 ], fs[ j + 2 ] ) );
	}

	for( var i = 0 ; i < this.letter.data[0].regular.path.length - 1; i++ ){
		var vs = this.letter.data[0].regular.path[i].vertex;
		this.geometry.vertices.push( new THREE.Vector3( vs[0], vs[1], -80 ) );
		this.vPositions.push(new THREE.Vector3( vs[0], vs[1], 0 ))
		var l = this.letter.data[0].regular.path.length - 1;
		var fs =  [2 + l,1 + l, 8 + l, 7 + l,2 + l, 8 + l, 2 + l,7 + l, 3 + l, 3 + l,7 + l, 6 + l, 3 + l,6 + l, 5 + l, 4 + l,3 + l, 5 + l, 8 + l,1 + l, 9 + l, 1 + l,0 + l, 9 + l, 9 + l,0 + l, 15 + l, 9 + l,15 + l, 10 + l, 10 + l,15 + l, 11 + l, 15 + l,14 + l, 11 + l, 11 + l,14 + l, 12 + l, 12 + l,14 + l, 13 + l ];
		for( var j = 0 ; j < fs.length ; j += 3 )  this.geometry.faces.push( new THREE.Face3( fs[ j ], fs[ j + 1 ], fs[ j + 2 ] ) );
	}
	var fs = [0, l, 1, 1, l, l + 1,1, l + 1, 2,2, l + 1, l + 2,2, l + 2, 3,3, l + 2, l + 3,3, l + 3, 4,4, l + 3, l + 4,4, l + 4, 5,5, l + 4, l + 5,5, l + 5, 6,6, l + 5, l + 6,6, l + 6, 7,7, l + 6, l + 7,7, l + 7, 8,8, l + 7, l + 8,8, l + 8, 9,9, l + 8, l + 9,9, l + 9, 10,10, l + 9, l + 10,10, l + 10, 11,11, l + 10, l + 11,11, l + 11, 12,12, l + 11, l + 12,12, l + 12, 13,13, l + 12, l + 13,13, l + 13, 14,14, l + 13, l + 14,14, l + 14, 15,15, l + 14, l + 15,15, l + 15, 16,15, l , 0];
	for( var j = 0 ; j < fs.length ; j += 3 )  this.geometry.faces.push( new THREE.Face3( fs[ j ], fs[ j + 1 ], fs[ j + 2 ] ) );
	
	var material = new THREE.ShaderMaterial( {
		vertexShader: 'varying vec3 vNormal; void main() { vNormal = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
		fragmentShader: 'varying vec3 vNormal; void main() { float color = ( -vNormal.x + vNormal.y * 2.0 + vNormal.z ) / 3.0 ; gl_FragColor = vec4( vec3( color ) ,1.0 ); }'
	} );
	
	this.geometry.computeBoundingBox();
	this.mesh = new THREE.Mesh( this.geometry, material );
	var bb = this.geometry.boundingBox;
	this.mesh.position.set( - bb.min.x -( bb.max.x - bb.min.x ) / 2, - bb.min.y -( bb.max.y - bb.min.y ) / 2, - bb.min.z -( bb.max.z - bb.min.z ) / 2 );
}

Volume.prototype.update = function( weight, italic ){

	this.weight = Math.floor( (this.letter.data.length - 1) * weight );
	this.italic = italic;

	for( var i = 0 ; i < this.letter.data[ this.weight ].regular.path.length - 1; i++ ){
		var vs = this.letter.data[ this.weight ].regular.path[i].vertex ;
		var vs = this.letter.data[ this.weight ].regular.path[i].vertex ;
		var nvs = this.letter.data[ Math.min( this.letter.data.length - 1, this.weight + 1 ) ].regular.path[i].vertex ;
		var ivs = this.letter.data[ this.weight ].italic.path[i].vertex ;
		this.vPositions[i] = this.vPositions[ i + this.letter.data[ this.weight ].regular.path.length - 1 ] = new THREE.Vector3( vs[0] + ( ivs[0] - vs[0] ) * this.italic, vs[1] + ( ivs[1] - vs[1] ) * this.italic, 0 )
	}
}

Volume.prototype.step = function(){
	this.time += this.timeInc;

	for( var i = 0 ; i < this.vPositions.length; i++ ){
		this.mesh.geometry.vertices[i].x += ( this.vPositions[i].x - this.mesh.geometry.vertices[i].x ) * 0.01;
		this.mesh.geometry.vertices[i].y += ( this.vPositions[i].y - this.mesh.geometry.vertices[i].y ) * 0.01;
	}

	var styleWeight = ( this.simplex.noise2D( this.time, 0.5 ) + 1 ) / 2 ;
	var styleItalic = ( this.simplex.noise2D( 0.5, this.time ) + 1 ) / 2 ;
	this.update( styleWeight, styleItalic );

	this.geometry.computeFaceNormals();
	this.mesh.geometry.normalsNeedUpdate = true;
	this.mesh.geometry.verticesNeedUpdate = true;
}

module.exports = Volume;