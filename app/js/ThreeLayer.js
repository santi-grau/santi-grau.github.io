var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;
var EffectComposer = require('three-effectcomposer')(THREE);

var ThreeLayer = function( options, instanceQueue ) {
	this.options = options || {};
	this.node = document.getElementById('threeLayer');
	this.active = true;

	// Three scene
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );
	this.node.appendChild( this.renderer.domElement );

	// this.postRT = new THREE.WebGLRenderTarget( this.node.offsetWidth * 2, this.node.offsetHeight * 2, {  } );
	// this.composer = new EffectComposer( this.renderer, this.postRT );

	// this.scene = new THREE.Scene();
	// this.camera = new THREE.OrthographicCamera();
	
	// this.renderPass = new EffectComposer.RenderPass( this.scene, this.camera );
	// this.composer.addPass( this.renderPass );


	// var pixelShader = {
	// 	uniforms: {
	// 		'tDiffuse': { value: null },
	// 		'resolution': { value: new THREE.Vector2( this.node.offsetWidth, this.node.offsetHeight ) },
	// 		'amount': { value: this.node.offsetWidth / 32 },
	// 		'time': { value: 0.0 },
	// 	},
	// 	vertexShader: require('./Shaders/pixel.vs'),
	// 	fragmentShader: require('./Shaders/pixel.fs')
	// };

	// this.pixelPass = new EffectComposer.ShaderPass( pixelShader );
	// this.pixelPass.renderToScreen = true;
 //  	this.composer.addPass( this.pixelPass );
}

inherits( ThreeLayer, EventEmitter );

ThreeLayer.prototype.resize = function( dims ) {
	this.renderer.setSize( dims.width * 2, dims.height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + dims.width + 'px; height:' + dims.height + 'px;' );
}

ThreeLayer.prototype.step = function( time ) {
	if( !this.active ) return;

	// this.pixelPass.uniforms.time.value = Math.random() * 100;
	// this.renderPass.scene = this.scene;
	// this.renderPass.camera = this.camera;
	// this.composer.render();
	if( this.preview.render ) this.preview.render( time );
	else this.renderer.render( this.preview.scene, this.preview.camera );
};

module.exports = ThreeLayer;