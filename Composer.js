var EffectComposer = require('three-effectcomposer')(THREE);
var Shaders = require('./Shaders');

var Composer = function( renderer, rendertarget, scene, camera, controller, node ){
	EffectComposer.apply(this, arguments);

	this.controller = controller;
	this.scene = scene;
	this.camera = camera;
	this.node = node;

	this.controller.on( 'beat', this.beat.bind( this ) );
	this.controller.on( 'bar', this.bar.bind( this ) );
	this.controller.on( 'fourbar', this.fourbar.bind( this ) );

	this.renderPass = new EffectComposer.RenderPass( this.scene, this.camera );
	this.addPass( this.renderPass);

	this.effects = {};

	for (var id in Shaders) {
		this[id] = new EffectComposer.ShaderPass( Shaders[id] );
		this.addPass( this[id] );
		if( this[id].uniforms.resolution ) this[id].uniforms.resolution.value = new THREE.Vector2( this.node.offsetWidth, this.node.offsetHeight );
		this[id].enabled = false;
		console.log( 'Available efects = ' + id );
		this.effects[id] = { mode : 0, enabled : false };
	}

	// activate invert by default
	this.invert.uniforms.on.value = Math.round( Math.random() );
	this.invert.enabled = true;

	// activate noise by default
	this.noise.enabled = true;

	// activate gray by default
	this.gray.enabled = true;
	this.gray.renderToScreen = true;
}

Composer.prototype = Object.create(EffectComposer.prototype);
Composer.prototype.constructor = Composer;


Composer.prototype.beat = function( ){
	
	if( this.effects.invert.mode == 5 ) this.invert.uniforms.on.value = Math.round( Math.random() );

	
}

Composer.prototype.bar = function( ){
	if( this.effects.invert.mode == 6 ) this.invert.uniforms.on.value = Math.round( Math.random() );
}

Composer.prototype.fourbar = function( ){
	// determine invert mode
	this.effects.invert.mode = Math.floor( Math.random( ) * 7 ); // 0-3 - 0ff, 4 - raf, 5 - beat, 6 - bar
	
	// determine RGBShift enabled and mode
	if( Math.random() > 0.7 ) this.RGBShift.enabled = true;
	else this.RGBShift.enabled = false;
	this.effects.RGBShift.enabled = this.RGBShift.enabled;
	this.effects.RGBShift.mode = Math.floor( Math.random( ) * 2 ); // 0 - beatPeak, 1 - beatLinear

	// determine pixel enabled and mode
	if( Math.random() > 0.7 ) this.pixel.enabled = true;
	else this.pixel.enabled = false;
	this.effects.pixel.enabled = this.pixel.enabled;
	this.effects.pixel.mode = Math.floor( Math.random( ) * 3 ); // 0 - beatPeak, 1 - barPeak, 2 - randomize

	if( Math.random() > 0.7 ) this.mpeg.enabled = true;
	else this.mpeg.enabled = false;
	this.effects.mpeg.enabled = this.mpeg.enabled;
	this.effects.mpeg.mode = Math.floor( Math.random( ) * 3 ); // 0 - beatPeak, 1 - barPeak, 2 - randomize
}

Composer.prototype.step = function( time ){

	if( this.effects.invert.mode == 4 ) this.invert.uniforms.on.value = Math.round( Math.random() );
	
	if( this.effects.RGBShift.enabled ){
		if( this.effects.RGBShift.mode == 0 ) this.RGBShift.uniforms.amount.value = this.controller.beatPeak / 100;
		if( this.effects.RGBShift.mode == 1 ) this.RGBShift.uniforms.amount.value = this.controller.beatLinear / 100;
		this.RGBShift.uniforms.angle.value = this.controller.noiseMid;
	}

	if( this.effects.pixel.enabled ){
		if( this.effects.pixel.mode == 2 ) {
			var pixelEnable = Math.round( ( this.controller.noiseMid + 1 ) / 2 );
			if( this.prevPixelState !== pixelEnable ) this.pixel.uniforms.amount.value = Math.floor( Math.random() * 1000 );
			if( pixelEnable ) this.pixel.enabled = true;
			else this.pixel.enabled = false;
			this.prevPixelState = this.pixel.enabled;
		} else {
			if( this.effects.pixel.mode == 0 ) this.pixel.uniforms.amount.value = 1000 - 900 * this.controller.shortBeat;
			if( this.effects.pixel.mode == 1 ) this.pixel.uniforms.amount.value = 1000 - 900 * this.controller.barPeak;
			if( this.pixel.uniforms.amount.value == 1000 ) this.pixel.enabled = false;
			else if( this.effects.pixel.enabled ) this.pixel.enabled = true;
		}
	}

	if( this.effects.mpeg.enabled ){
		if( this.effects.mpeg.mode == 2 ) {
			var mpegEnable = Math.round( ( this.controller.noiseMid + 1 ) / 2 );
			if( this.prevmpegState !== mpegEnable ) this.mpeg.uniforms.amount.value = new THREE.Vector3( Math.random(), Math.random(), Math.random() );
			if( mpegEnable ) this.mpeg.enabled = true;
			else this.mpeg.enabled = false;
			
		} else {
			if( this.effects.mpeg.mode == 0 ) {
				if( this.controller.shortBeat == 0 ) this.mpeg.enabled = false;
				else this.mpeg.enabled = true;
			}
			if( this.effects.mpeg.mode == 1 ) {
				if( this.controller.barPeak == 0 ) this.mpeg.enabled = false;
				else this.mpeg.enabled = true;
			}
		}
	}
	this.mpeg.uniforms.time.value = 1000 + Math.sin(time) * 1000;

	this.noise.uniforms.time.value = this.controller.random;
}

module.exports = Composer;