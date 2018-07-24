var Controller = require('./Controller');
var Body = require('./Body');
var Composer = require('./Composer');

var Jansky = function( dims, renderer ){
	this.renderer = renderer;
	this.time = 0;
	this.timeStep = 0.005;

	this.vals = [];

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	
	this.data = {
		'song' : 'COMMEDIA',
		'bpm' : 125
	}

	this.controller = new Controller( this.data.bpm );
	this.body = new Body( this.controller, { fontSize : 13, word : this.data.song } );
	this.scene.add( this.body );

	var renderTarget = new THREE.WebGLRenderTarget( dims.width * 2, dims.height * 2, {  } );
	this.composer = new Composer( this.renderer, renderTarget, this.scene, this.camera, this.controller );
}

Jansky.prototype.setActive = function( x, y ){
	this.setMouse( x, y );
}

Jansky.prototype.setMouse = function( x, y ){

}

Jansky.prototype.resize = function( dims ){
	var width = dims.width, height = dims.height;
	var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;	
	this.renderer.setSize( width * 2, height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + width + 'px; height:' + height + 'px;' );
	this.camera.updateProjectionMatrix( );

	this.body.resize( width, height );
}

Jansky.prototype.step = function( time ){
	this.time += this.timeStep;

	this.controller.step( time );
	this.body.step( time , this.renderer );

}

Jansky.prototype.step = function( time ){
	this.time += this.timeStep;
	this.controller.step( time );
	this.body.step( time , this.renderer );
}

Jansky.prototype.render = function( time ){
	this.composer.step( time );
}

module.exports = Jansky;