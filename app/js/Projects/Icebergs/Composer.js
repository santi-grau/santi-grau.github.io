var EffectComposer = require('three-effectcomposer')(THREE);
var UnrealBloomPass = require('./bloomPass');

var Composer = function( renderer, rendertarget, scene, camera ){
	EffectComposer.apply(this, arguments);
	this.scene = scene;
	this.camera = camera;
	this.renderer = renderer;
	this.time = 0;
	this.timeInc = 0.1;

	this.msaaRenderPass = new THREE.ManualMSAARenderPass( scene, camera );
	this.addPass( this.msaaRenderPass );
	this.msaaRenderPass.sampleLevel = 1;
	this.msaaRenderPass.unbiased = true;

	this.bloomPass = new UnrealBloomPass( new THREE.Vector2( rendertarget.width, rendertarget.height ), 3, 0.9, 0.1 ); // strength, radius, threshold;
	this.addPass( this.bloomPass );
	this.bloomPass.renderToScreen = true;
}

Composer.prototype = Object.create(EffectComposer.prototype);
Composer.prototype.constructor = Composer;

Composer.prototype.step = function( time ){
	this.time += this.timeInc;

	this.bloomPass.strength = Math.random() * 3;
	this.bloomPass.radius = Math.random() * 0.8;

	this.render();
}

module.exports = Composer;