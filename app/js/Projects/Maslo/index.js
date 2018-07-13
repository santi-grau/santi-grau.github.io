var SimplexNoise = require('simplex-noise');
var Ring = require('./Ring');

var Maslo = function( ){
	this.group = new THREE.Object3D();
	this.time = 0;
	this.timeStep = 0.005;

	this.vals = [];

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	var simplex = new SimplexNoise( Math.random );
	this.rings = [];

	this.timeStepEased = 0.005;
	this.groupRotation = 0;

	for( var i = 0 ; i < 8 ; i++ ){
		this.vals[ i ] = {
			gaussIt : 0.98,
			weightIn : 1,
			intensity : 0.21,
			rotation : Math.PI * 2 / 90 * i,
			osc : 0.06
		}
		var ring = new Ring( i, simplex );
		this.rings.push( ring );
		this.group.add( ring.mesh );
	}

	for( var i = 0 ; i < 8 ; i++ ) this.rings[i].setColor( [1,1,1], [0,0,0] );

	this.scene.add( this.group );

}

Maslo.prototype.setActive = function( x, y ){
	this.setMouse( x, y );
}

Maslo.prototype.setMouse = function( x, y ){
	
	this.timeStepEased = 0.005 + 0.1 * x;

	this.groupRotation = -Math.PI * 2 * y;

	for( var i = 0 ; i < 8 ; i++ ){
		this.vals[ i ] = {
			gaussIt : 0.98 - 0.98 * x,
			weightIn : 1 - 0.9 * x,
			intensity : 0.21 + 2 * x,
			rotation : Math.PI * 2 / 90 * i + Math.PI * 2 * ( i / 8 ) * x,
			osc : 0.06 + 0.04 * x
		}
	}

}

Maslo.prototype.resize = function( dims ){
	for( var i = 0 ; i < 8 ; i++ ) this.rings[i].setRadius( dims.width, dims.height );
	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Maslo.prototype.computeIdle = function(){
	this.timeStep += ( this.timeStepEased - this.timeStep ) * 0.1;
	this.group.rotation.z += ( this.groupRotation - this.group.rotation.z ) * 0.1;

	for( var i = 0 ; i < 8 ; i++ ){
		this.rings[i].gaussIt += ( this.vals[i].gaussIt - this.rings[i].gaussIt ) * 0.1;
		this.rings[i].weightIn += ( this.vals[i].weightIn - this.rings[i].weightIn ) * 0.1;
		this.rings[i].intensity += ( this.vals[i].intensity - this.rings[i].intensity ) * 0.1;
		this.rings[i].mesh.rotation.z += ( this.vals[i].rotation - this.rings[i].mesh.rotation.z ) * 0.1;
		this.rings[i].osc += ( this.vals[i].osc - this.rings[i].osc ) * 0.1;
	}

}

Maslo.prototype.step = function( time ){
	this.computeIdle();
	this.time += this.timeStep;
	for( var i = 0 ; i < this.rings.length ; i++ ) this.rings[i].step( this.time, i, ( i > 0 ) ? this.rings[ i - 1 ].ps : null );
}

module.exports = Maslo;