var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits

var Data = require('./Data');
var ParticleGeometry = require('./ParticleGeometry');
var ParticleMaterial = require('./ParticleMaterial');

var Quantum = function( dims ){
	this.dims = dims;
	this.group = new THREE.Object3D();

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.activeLetter = 0;

	// Load data image
	this.dataTexture = new Image();
	this.dataTexture.crossOrigin = 'Anonymous';
	this.dataTexture.src = window._PATH_ + 'quantum/font.png';
	this.dataTexture.addEventListener('load', this.onImageReady.bind(this) );
	this.time = 1;
	this.letterRes = 128; // 32, 64, 128, 256, 512
	this.scale =  new THREE.Vector3( 2, 0.5, 2 ); // scale of the letters ( size )
	this.weight = new THREE.Vector3( 0.509090909090909, 0, 1 ); // weight of letters
	this.speed =  new THREE.Vector3( 0.007636363636363636, 0, 0.03 );
	this.pointSize = new THREE.Vector4( 0, 0.2, 1, 15 ); // min size, max size, min range, max range
	this.oscillation = new THREE.Vector4( 0.10909090909090909, 0.14545454545454545, 0, 40 ); // oscillation distance
	this.dispersion = new THREE.Vector4( 0, 0.10909090909090909, 0, 200 ); // dispersion distance
	
	this.dispersionEased = new THREE.Vector2( 0, 0.10909090909090909 );
	this.color = new THREE.Vector3( 0, 0, 0 ); // color of particles
	this.backgroundColor = new THREE.Vector3( 0, 0, 0 ); // color of background

	this.scene.add( this.group );
}

inherits( Quantum, EventEmitter );

Quantum.prototype.onImageReady = function( e ){
	this.data = new Data( this );
	// console.log(this.data)
	this.geometry = new ParticleGeometry( this )
	this.material = new ParticleMaterial( this );
	this.points = new THREE.Points( this.geometry.geometry, this.material.material );
	this.points.frustumCulled = false;
	this.group.add( this.points );
	var l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var s = l.substr( Math.floor( Math.random( ) * l.length ), 1 ).charCodeAt(0);
	this.geometry.addLetter( s );
	this.emit( 'ready' );
}

Quantum.prototype.setActive = function( xmouse, ymouse, dims ){
	
}

Quantum.prototype.setMouse = function( x, y ){
	var l = 'QuantumFont';
	
	var al = Math.floor( y * l.length );
	if( al !== this.activeLetter ){
		this.activeLetter = al;
		var s = l.substr( al, 1 ).charCodeAt(0);
		this.geometry.addLetter( s );
	}

	var v = new THREE.Vector2( Math.abs( (  x * this.dims.width - this.dims.width / 2 ) / ( this.dims.width / 2 ) ), 0 );
	this.dispersionEased.x = v.length() / 8;
	this.dispersionEased.y = 0.05909090909090909 + v.length() / 4;
	
}

Quantum.prototype.resize = function( dims ){
	this.dims = dims;
	this.group.position.set( dims.x, dims.y, 0 );
	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );

	this.material.material.uniforms.dispersion.value.x = this.dispersion.x;

	var s = dims.height / 288 / 2;
	this.group.scale.set( s, s, 1 );
}

Quantum.prototype.step = function( time ) {

	this.dispersion.x += ( this.dispersionEased.x - this.dispersion.x ) * 0.1;
	this.dispersion.y += ( this.dispersionEased.y - this.dispersion.y ) * 0.1;

	this.material.material.uniforms.dispersion.value.x = this.dispersion.x;
	this.material.material.uniforms.dispersion.value.y = this.dispersion.y;

	this.time += this.speed.x;
	this.points.material.uniforms.settings.value.x = this.time;
};

module.exports = Quantum;