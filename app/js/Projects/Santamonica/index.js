var letters = require( './letters.json' );
var fresnelVs = require('./fresnel.vs');
var fresnelFs = require('./fresnel.fs');
var Santamonica = function(){
	
	this.group = new THREE.Object3D();
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 24, window.innerWidth / window.innerHeight, 0.1, 10000 );

	this.cameraAngleY = 0;
	this.cameraAngleYe = 0;
	
	this.positionFrames = [
		[[24,152,1,true]],
		[[23.48,256.77,0.87,true],[266,157,1]],
		[[23.03,347.93,0.76,true],[235,261.13,0.87],[520,157,1]],
		[[22.63,427.24,0.66,true],[207,351.72,0.76],[454.88,261.13,0.87],[705,157,1]],
		[[22.29,496.24,0.57,true],[183,430.54,0.66],[398.17,351.72,0.76],[615.61,261.13,0.87],[823,157,1]],
		[[21.99,556.27,0.5,true],[162,499.1,0.57],[348.8,430.54,0.66],[538.27,351.72,0.76],[719,261.13,0.87],[1004,157,1]],
		[[21.73,608.5,0.43,true],[143,558.76,0.5],[306.75,499.1,0.57],[470.98,430.54,0.66],[628,351.72,0.76],[875.88,261.13,0.87],[1259,153,1,true]],
		[[21.51,653.93,0.38,true],[127,610.66,0.43],[268.96,558.76,0.5],[411.72,499.1,0.57],[549,430.54,0.66],[765.17,351.72,0.76],[1097.66,257.64,0.87,true],[1384,157,1]],
		[[21.31,693.46,0.33,true],[113,655.82,0.38],[236.41,610.66,0.43],[361.5,558.76,0.5],[480,499.1,0.57],[667.8,430.54,0.66],[957.62,348.68,0.76,true],[1205.88,261.13,0.87],[1487,157,1]],
		[[21.14,727.85,0.29,true],[101,695.1,0.33],[208.05,655.82,0.38],[317.3,610.66,0.43],[421,558.76,0.5],[583.75,499.1,0.57],[835.85,427.9,0.66,true],[1052.17,351.72,0.76],[1295.88,261.13,0.87],[1431,153,1,true]],
		[[20.99,757.77,0.25,true],[90,729.26,0.29],[183.88,695.1,0.33],[279.13,655.82,0.38],[368,610.66,0.43],[509.96,558.76,0.5],[729.31,496.81,0.57,true],[917.8,430.54,0.66],[1130.17,351.72,0.76],[1247.66,257.64,0.87,true],[1501,157,1]]];
	
	this.currentFrame = this.positionFrames.length - 1;

	var loader = new THREE.JSONLoader();
	// var material = new THREE.MeshNormalMaterial();

	

	for( var i = 0 ; i < letters.length; i++ ){
		var letter = loader.parse( letters[i] );
		var material = new THREE.ShaderMaterial( {
			vertexShader: fresnelVs,
			fragmentShader: fresnelFs
		} );

		var mesh = new THREE.Mesh( letter.geometry, material );

		mesh.geometry.computeBoundingBox();
		var letterGroup = new THREE.Object3D();
		mesh.position.y = -mesh.geometry.boundingBox.min.y;
		letterGroup.add( mesh );
		letterGroup.visible = false;
		this.group.add( letterGroup )
	}

	this.setGroupPosition();
	this.currentFrame = 0;

	var size = 10;
	var divisions = 10;

	this.scene.add( this.group );
}

Santamonica.prototype.setActive = function( x, y ){
	this.setMouse( x, y );
	this.cameraAngleYe = ( Math.PI / 8 ) * ( y - 0.5 );
}

Santamonica.prototype.setMouse = function( x, y ){
	var frame = Math.round( x * ( this.positionFrames.length - 1 ) );
	this.cameraAngleY = ( Math.PI / 8 ) * ( y - 0.5 );
	if( frame == this.currentFrame ) return;
	this.currentFrame = frame;
	this.setGroupPosition();

}

Santamonica.prototype.setGroupPosition = function(){
	var pos = this.positionFrames[ this.currentFrame ];

	for( var i = 0 ; i < pos.length ; i++ ){
		for( var j = 0 ; j < pos.length ; j++ ){
			var mesh = this.group.children[ j ];
			var yt = 0;
			var scale = pos[j][2];
			if( pos[j][3] ) yt -= 10 * ( scale );
			mesh.position.set( parseFloat( pos[j][0] ), yt, 0 );
			
			mesh.scale.set( scale, scale, 2 );
			mesh.visible = true;
		}

		for( var j = pos.length; j < this.group.children.length ; j++ ) this.group.children[ j ].visible = false;
	}
	
	var bb3 = new THREE.Box3().setFromObject( this.group );
	var w = ( bb3.max.x - bb3.min.x );
	var h = ( bb3.max.y - bb3.min.y );
	var bb1 = new THREE.Box3().setFromObject( this.group.children[ 0 ] );
	var bb2 = new THREE.Box3().setFromObject( this.group.children[ pos.length - 1 ] );
	this.group.position.x = -( bb2.max.x - bb1.min.x ) / 2 - pos[0][0];
	this.group.position.y = -h / 2;
}

Santamonica.prototype.resize = function( dims ){
	var bb3 = new THREE.Box3().setFromObject( this.group );
	var w = ( bb3.max.x - bb3.min.x ) * 1.1;
	var vFOV = this.camera.fov * Math.PI / 180;
	aspect = dims.width / dims.height;
	var hFOV = 2 * Math.atan( Math.tan( vFOV / 2 ) * aspect );
	
	this.cameraDist = w / ( 2 * Math.tan( ( hFOV / 2 ) ) );
	
	this.camera.position.z = this.cameraDist;
	this.camera.aspect = dims.width / dims.height;
	this.camera.updateProjectionMatrix();
}

Santamonica.prototype.step = function( time ){
	this.cameraAngleYe += ( this.cameraAngleY - this.cameraAngleYe ) * 0.1;
	var cameraVector = new THREE.Vector3( 0, 0, 1 );
	cameraVector.applyAxisAngle( new THREE.Vector3( 1, 0, 0 ), this.cameraAngleYe );
	cameraVector.setLength( this.cameraDist );
	this.camera.position.set( cameraVector.x, cameraVector.y, cameraVector.z );
	this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
}

module.exports = Santamonica;
