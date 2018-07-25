var objs = require( './geos.json' );
var SimplexNoise = require('simplex-noise');

var Composer = require('./Composer');
var Icebergs = function( dims, renderer ){
	this.group = new THREE.Object3D();

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	this.simplex = new SimplexNoise(Math.random);

	this.activeIb = 0;
	this.rotation = 0;
	this.rotationEased = 0;
	this.wireframe = false;
	this.time = 0;
	this.timeInc = 0.05;

	var geos = objs;
	var loader = new THREE.JSONLoader();
	
	var material = new THREE.MeshBasicMaterial( { color : 0xffffff, wireframe : true } );

	for( var i = 0 ; i < geos.length ; i++ ){
		var geometry = loader.parse( geos[ i ] ).geometry;
		geometry.computeBoundingBox();
		var mesh = new THREE.Mesh( geometry, material );
		mesh.rotation.x = Math.PI / 2;
		mesh.visible = false;
		this.group.add( mesh );
	}

	this.scene.add( this.group );

	this.postRT = new THREE.WebGLRenderTarget( dims.width * 2, dims.height * 2, {  } );
	this.composer = new Composer( renderer, this.postRT, this.scene, this.camera );
}

Icebergs.prototype.setActive = function( x, y ){
	this.rotationEased = ( Math.PI / 4 ) * ( y - 0.5 );
	this.setMouse( x, y );
}

Icebergs.prototype.setMouse = function( x, y ){
	this.rotation = ( Math.PI / 4 ) * ( y - 0.5 );
	this.group.children[ this.activeIb ].visible = false;
	this.activeIb = Math.round( x  * ( this.group.children.length - 1 ) );
	this.group.children[ this.activeIb ].visible = true;
}

Icebergs.prototype.resize = function( dims ){
	var bb = this.group.children[ 0 ].geometry.boundingBox;
	var d = bb.max.z - bb.min.z;
	var s = dims.height / d * 0.7;
	this.group.scale.set( s, s, s );
	this.group.position.set( dims.x, dims.y, 0 );

	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Icebergs.prototype.step = function( time ){

	this.time += this.timeInc;
	var n = this.simplex.noise2D( this.time, 0.5 );

	this.rotationEased += ( this.rotation - this.rotationEased ) * 0.1;
	this.group.rotation.x = this.rotationEased;
	for( var i = 0 ; i < this.group.children.length; i++ ) this.group.children[ i ].rotation.z += 0.01;
}

Icebergs.prototype.render = function( time ){
	this.composer.step( time );
}

module.exports = Icebergs;