var Composer = require('./composer');
var Volume = require('./volume');

var Wwdc = function( ){
	this.group = new THREE.Object3D();

	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 24, window.innerWidth / window.innerHeight, 0.1, 10000 );

	this.cameraAngleX = -Math.PI / 8;
	this.cameraAngleY = -Math.PI / 8;
	
	this.cameraAngleXe = -Math.PI / 8;
	this.cameraAngleYe = -Math.PI / 8;

	this.volume = new Volume( );
	this.group.add( this.volume.mesh );
	
	var bb = this.volume.geometry.boundingBox;
	var gridHelper = new THREE.GridHelper( 4000, 100 );
	var bb = this.volume.geometry.boundingBox;
	gridHelper.position.y = - bb.min.y -( bb.max.y - bb.min.y ) / 2;
	this.group.add( gridHelper );

	this.scene.add( this.group );
}

Wwdc.prototype.setActive = function( x, y ){
	this.cameraAngleXe = -Math.PI / 8 - ( Math.PI / 4 ) * ( x - 0.5 );
	this.cameraAngleYe = -Math.PI / 8 - ( Math.PI / 8 ) * ( y - 0.5 );
	this.setMouse( x, y );

}

Wwdc.prototype.resize = function( dims ) {
	var vFOV = this.camera.fov * Math.PI / 180;
	var bb = this.volume.geometry.boundingBox;
	this.cameraDist = ( ( bb.max.y - bb.min.y ) * 2 ) / ( 2 * Math.tan( vFOV / 2 ) );
	// console.log('resize wwdc')
	this.camera.aspect = dims.width / dims.height;
	this.camera.updateProjectionMatrix();
	this.group.position.set( dims.x, dims.y, 0 );
}

Wwdc.prototype.setMouse = function( x, y ){
	this.cameraAngleX = -Math.PI / 8 - ( Math.PI / 8 ) * ( x - 0.5 );
	this.cameraAngleY = -Math.PI / 8 - ( Math.PI / 8 ) * ( y - 0.5 );
}

Wwdc.prototype.setColor = function( c0, c1 ){
	
}

Wwdc.prototype.step = function( time ) {

	this.cameraAngleXe += ( this.cameraAngleX - this.cameraAngleXe ) * 0.1;
	this.cameraAngleYe += ( this.cameraAngleY - this.cameraAngleYe ) * 0.1;

	var cameraVector = new THREE.Vector3( 0, 0, 1 );
	cameraVector.applyAxisAngle( new THREE.Vector3( 0, 1, 0 ), this.cameraAngleXe );
	cameraVector.applyAxisAngle( new THREE.Vector3( 1, 0, 0 ), this.cameraAngleYe );
	cameraVector.setLength( this.cameraDist );
	this.camera.position.set( cameraVector.x, cameraVector.y, cameraVector.z );
	this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	this.volume.step();
};

module.exports = Wwdc;