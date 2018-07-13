var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;

var vs = require('./shaders/mugshotsVs.glsl')
var fs = require('./shaders/mugshotsFs.glsl')

var Mugshots = function( ){
	this.group = new THREE.Object3D();
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	var tex;
	
	this.arrayImages = [ 5, 4 ];
	tex = window._PATH_ + 'mugshots/t1.gif';
	this.imSize = new THREE.Vector3( 0.2, 0.25 );

	this.totalImages = 16;
	
	this.current = [ 0, 0 ];
	
	this.order = [];
	for( var i = 0 ; i < this.totalImages ; i++ ) this.order[i] = i;
	this.order.sort( function() { return .5 - Math.random(); } );

	this.scene.add( this.group );

	new THREE.TextureLoader().load( tex, this.textureLoaded.bind( this ) );
}

inherits( Mugshots, EventEmitter );

Mugshots.prototype.textureLoaded = function( texture ){
	var geometry = new THREE.PlaneBufferGeometry( 1, 1 );
	var material = new THREE.MeshBasicMaterial( { map : texture } );

	var material = new THREE.ShaderMaterial({
		uniforms : {
			imSize : { value : this.imSize },
			faces : { value : texture },
			resolution : { value : new THREE.Vector2( 0, 0 ) },
			pos : { value : new THREE.Vector2( 0, 0.1 ) },
			current : { value : new THREE.Vector2( this.current[0], this.current[1] ) }
		},
		vertexShader: vs,
		fragmentShader: fs
	});

	this.plane = new THREE.Mesh( geometry, material );
	this.group.add( this.plane );
	this.emit( 'ready' );
}

Mugshots.prototype.setMouse = function( x, y ){
	this.plane.material.uniforms.pos.value = new THREE.Vector2( x, 1-y );

	if( this.current[ 0 ] < this.arrayImages[ 0 ] - 1 ){
		this.current[ 0 ]++;
	} else {
		this.current[ 0 ] = 0;
		if( this.current[ 1 ] < this.arrayImages[ 1 ] - 1 ) this.current[ 1 ]++;
		else this.current[ 1 ] = 0;
	}

	// console.log( x,1-y )
	// console.log( this.dims.height / this.dims.width )

	this.plane.material.uniforms.current.value = new THREE.Vector2( this.current[0], this.current[1] );

}

Mugshots.prototype.resize = function( dims ){
	this.plane.scale.set( dims.width, dims.height, 1 );
	// console.log(dims.height/dims.width)
	this.dims = dims;

	// console.log( this.dims.height / this.dims.width )

	this.plane.material.uniforms.resolution.value = new THREE.Vector2( dims.width, dims.height );
	
	
	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Mugshots.prototype.step = function( time ){
	
}

module.exports = Mugshots;