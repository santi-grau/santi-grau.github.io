var vs = require('./shaders/shadows.vs');
var fs = require('./shaders/shadows.fs');

var Sxsw = function( ){
	this.group = new THREE.Object3D();

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	this.time = 0;
	this.timeInc = 0.001;
	this.mouse = new THREE.Vector2( 0, 0 );
	this.mouseEased = new THREE.Vector2( 0, 0 );

	this.scale = 0.5;
	this.sdfCam = new THREE.PerspectiveCamera();
	this.sdfCam.position.z = 5;
	this.sdfCam.fov = 14;
	
	var geometry = new THREE.PlaneBufferGeometry( 1, 1 );
	var material = new THREE.ShaderMaterial({
		uniforms : {
			time : { value : 0 },
			ps : { value : new THREE.Vector2( 0, 0 ) },
			seeds : { value : new THREE.Vector4( Math.random(), Math.random(), Math.random(), Math.random() ) },
			resolution : { value : null },
			camPosition : { value : null },
			camViewMatrix : { value : null },
			camInvProjectionMatrix : { value : null }
		},
		vertexShader: vs,
		fragmentShader: fs
	});

	this.plane = new THREE.Mesh( geometry, material );
	this.group.add( this.plane );
	this.scene.add( this.group );
}

Sxsw.prototype.setActive = function( x, y ){
	
}

Sxsw.prototype.setMouse = function( x, y ){
	this.mouse = new THREE.Vector2( x, y );
	
}

Sxsw.prototype.resize = function( dims ){

	this.dims = dims;

	var camView = { aspect : dims.width / dims.height, near : 3, far : 8 };
	for ( var prop in camView) this.sdfCam[ prop ] = camView[ prop ];
	this.sdfCam.updateProjectionMatrix( );
	
	this.sdfCam.invProjectionMat = new THREE.Matrix4();
	this.sdfCam.invProjectionMat.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );
	var a = this.sdfCam.projectionMatrix.elements[0];
	var b = this.sdfCam.projectionMatrix.elements[5];
	var c = this.sdfCam.projectionMatrix.elements[10];
	var d = this.sdfCam.projectionMatrix.elements[14];
	var e = this.sdfCam.projectionMatrix.elements[11];
	this.sdfCam.invProjectionMat.elements[0] = 1.0 / a;
	this.sdfCam.invProjectionMat.elements[5] = 1.0 / b;
	this.sdfCam.invProjectionMat.elements[11] = 1.0 / d;
	this.sdfCam.invProjectionMat.elements[14] = 1.0 / e;
	this.sdfCam.invProjectionMat.elements[15] = -c / (d * e);
		
	this.plane.material.uniforms.camPosition.value = this.sdfCam.position;
	this.plane.material.uniforms.camViewMatrix.value = this.sdfCam.matrixWorld;
	this.plane.material.uniforms.camInvProjectionMatrix.value = this.sdfCam.invProjectionMat;
	this.plane.material.uniforms.resolution.value = new THREE.Vector2( dims.width * 2, dims.height * 2 );

	this.plane.scale.set( dims.width * 0.8, dims.height * 0.8, 1 );

	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 10;
	this.camera.updateProjectionMatrix( );
}

Sxsw.prototype.step = function( time ){

	this.mouseEased.x += ( this.mouse.x - this.mouseEased.x ) * 0.1;
	this.mouseEased.y += ( this.mouse.y - this.mouseEased.y ) * 0.1;

	this.plane.material.uniforms.ps.value = this.mouseEased;

	this.time += this.timeInc;
	this.plane.material.uniforms.time.value = this.time;
	
}

module.exports = Sxsw;