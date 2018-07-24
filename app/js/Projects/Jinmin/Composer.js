var EffectComposer = require('three-effectcomposer')(THREE);
// var UnrealBloomPass = require('./bloomPass');
var ManualMSAARenderPass = require('./msaaPass');
// var SSAOenderPass = require('./ssaoPass');

var SSAO = require('./ssao');

var SimplexNoise = require( 'simplex-noise' );

var Composer = function( renderer, rendertarget, scene, camera ){
	EffectComposer.apply(this, arguments);
	this.scene = scene;
	this.camera = camera;
	this.renderer = renderer;
	this.time = 0;
	this.timeInc = 0.1;

	this.simplex = new SimplexNoise( Math.random );

	// this.renderPass = new EffectComposer.RenderPass( scene, camera );
	// this.addPass( this.renderPass);

	this.msaaRenderPass = new THREE.ManualMSAARenderPass( scene, camera );
	this.addPass( this.msaaRenderPass );
	this.msaaRenderPass.sampleLevel = 2;
	this.msaaRenderPass.unbiased = true;

	this.depth = new THREE.WebGLRenderTarget( rendertarget.width, rendertarget.height, {  } );	
	this.ssao = SSAO;
	this.ssaoPass = new EffectComposer.ShaderPass( this.ssao );
	this.ssaoPass.uniforms.tDepth.value = this.depth.texture;
	this.ssaoPass.uniforms.cameraNear.value = this.camera.near;
	this.ssaoPass.uniforms.cameraFar.value = this.camera.far;

	this.addPass( this.ssaoPass );
	// this.ssaoPass.renderToScreen = true;

	this.noise = {
		uniforms: {
			'tDiffuse': { value: null },
			'seed' : { value : new THREE.Vector2( Math.random(), Math.random() ) }
		},
		vertexShader: require('./shaders/base.vs'),
		fragmentShader: require('./shaders/base.fs')
	}

	this.noisePass = new EffectComposer.ShaderPass( this.noise );
	this.addPass( this.noisePass );
	this.noisePass.renderToScreen = true;
}

Composer.prototype = Object.create(EffectComposer.prototype);
Composer.prototype.constructor = Composer;

Composer.prototype.step = function( time ){
	this.time += this.timeInc;
	if( this.noisePass ) this.noisePass.uniforms.seed.value = new THREE.Vector2( Math.random() * 1000, Math.random() * 1000 );

	this.scene.overrideMaterial = new THREE.MeshDepthMaterial();
	this.renderer.render( this.scene, this.camera, this.depth, true );
	this.scene.overrideMaterial = null;

	this.render();
}

module.exports = Composer;