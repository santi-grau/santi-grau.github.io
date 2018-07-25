var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;
var EffectComposer = require('three-effectcomposer')(THREE);

var ThreeLayer = function( options, instanceQueue ) {
	this.options = options || {};
	this.node = document.getElementById('threeLayer');
	this.active = true;

	this.distort = 0;

	// Three scene
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );
	this.node.appendChild( this.renderer.domElement );

	this.postRT = new THREE.WebGLRenderTarget( this.node.offsetWidth * 1.5, this.node.offsetHeight * 1.5, {  } );
	this.composer = new EffectComposer( this.renderer, this.postRT );

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	
	this.renderPass = new EffectComposer.RenderPass( this.scene, this.camera );
	this.composer.addPass( this.renderPass );

	var pixelShader = {
		uniforms: {
			'tDiffuse': { value: null },
			'amount': { value: this.distort },
			'time': { value: 0.0 },
		},
		vertexShader: require('./Shaders/pixel.vs'),
		fragmentShader: require('./Shaders/pixel.fs')
	};

	this.pixelPass = new EffectComposer.ShaderPass( pixelShader );
	this.pixelPass.renderToScreen = true;
	this.composer.addPass( this.pixelPass );
}

inherits( ThreeLayer, EventEmitter );

ThreeLayer.prototype.setActive = function( p ){
	this.preview = p;
	this.distort = 3;
	
	if( this.distortTween ) this.distortTween.kill();

	this.distortTween = TweenLite.to( this, 0.5, {
		distort : 0,
		ease: RoughEase.ease.config({ 
			template: Power3.easeOut,
			strength: 2,
			points: 15,
			taper: "out",
			randomize: true,
			clamp: true
		})
	} );
}

ThreeLayer.prototype.resize = function( dims ) {
	this.renderer.setSize( dims.width * 2, dims.height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + dims.width + 'px; height:' + dims.height + 'px;' );
}

ThreeLayer.prototype.step = function( time ) {
	if( !this.active ) return;
	
	if( this.distort > 0 ){
		if( this.preview.render ){
			this.preview.composer.passes[ this.preview.composer.passes.length - 2 ].renderToScreen = false;
			this.preview.composer.passes[ this.preview.composer.passes.length - 1 ].renderToScreen = true;
			this.preview.composer.passes[ this.preview.composer.passes.length - 1 ].enabled = true;
			this.preview.composer.passes[ this.preview.composer.passes.length - 1 ].uniforms.amount.value = this.distort;
			this.preview.composer.passes[ this.preview.composer.passes.length - 1 ].uniforms.time.value = time;
			this.preview.render( time );
		} else {
			this.renderPass.scene = this.preview.scene;
			this.renderPass.camera = this.preview.camera;
			this.pixelPass.uniforms.time.value = time;
			this.pixelPass.uniforms.amount.value = this.distort;
			this.composer.render();
		}
	} else {
		if( this.preview.render ){
			this.preview.composer.passes[ this.preview.composer.passes.length - 2 ].renderToScreen = true;
			this.preview.composer.passes[ this.preview.composer.passes.length - 1 ].renderToScreen = false;
			this.preview.composer.passes[ this.preview.composer.passes.length - 1 ].enabled = false;
			this.preview.render( time );
		} else {
			this.renderer.render( this.preview.scene, this.preview.camera );
		}
	}
};

module.exports = ThreeLayer;