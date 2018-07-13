var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;
var SimplexNoise = require('simplex-noise');
var Gsap = require('gsap');

var Controller = function( bpms ){
	this.time = 0;
	this.timeInc = 0.1;

	this.reset( bpms );
	
	this.beatLinear = 0;
	this.barLinear = 0;
	this.fourbarLinear = 0;

	this.alternate = 0;

	this.beatPeak = 0;
	this.shortBeat = 0;

	this.barPeak = 0;

	this.noiseHigh = 0;
	this.noiseMid = 0;
	this.noiseLow = 0;

	this.random = 0;

	this.simplex = new SimplexNoise( Math.random );
}

inherits( Controller, EventEmitter );

Controller.prototype.reset = function( bpms ){
	this.bpms = 60 / bpms * 1000;
	if( this.beatInterval ) clearInterval( this.beatInterval );
	this.beatInterval = setInterval( this.beat.bind( this ), this.bpms );
	this.beats = 0;
	this.bars = 0;
	this.beat();
	this.bar();
	this.fourbar();
}

Controller.prototype.beat = function( ){
	var bpmInterval = this.bpms;
	this.emit('beat');
	this.alternate = 1 - this.alternate;
	bpmInterval /= 1000; 
	var tl = new TimelineLite();
	tl.to( this, bpmInterval * 0.1, { beatPeak : 1 } )
	.to( this, bpmInterval * 0.9, { beatPeak : 0 } );

	var tl = new TimelineLite();
	tl.to( this, bpmInterval * 0.1, { shortBeat : 1 } )
	.to( this, bpmInterval * 0.5, { shortBeat : 0 } );

	var tl2 = new TimelineLite();
	tl2.fromTo( this, bpmInterval, { beatLinear : 0 }, { beatLinear : 1 } );

	if( this.beats < 3 ) this.beats++;
	else {
		this.beats = 0;
		this.bar( this.bpms );
		if( this.bars < 3 ) this.bars++;
		else {
			this.bars = 0;
			this.fourbar( this.bpms );
		}
	}
}

Controller.prototype.bar = function( ){
	this.emit('bar');
	var bpmInterval = this.bpms;
	bpmInterval /= 1000;
	bpmInterval *= 4;
	var tl = new TimelineLite();
	tl.fromTo( this, bpmInterval, { barLinear : 0 }, { barLinear : 1 } );

	var tl = new TimelineLite();
	tl.to( this, bpmInterval * 0.05, { barPeak : 1 } )
	.to( this, bpmInterval * 0.15, { barPeak : 0 } );
}

Controller.prototype.fourbar = function( ){
	this.emit('fourbar');
	var bpmInterval = this.bpms;
	bpmInterval /= 1000;
	bpmInterval *= 16;
	var tl = new TimelineLite();
	tl.fromTo( this, bpmInterval, { fourbarLinear : 0 }, { fourbarLinear : 1 } );
}

Controller.prototype.step = function( time ){
	this.time += this.timeInc;

	this.noiseHigh = this.simplex.noise2D( 0.5, this.time );
	this.noiseMid = this.simplex.noise2D( 0.1, this.time / 50 );
	this.noiseLow = this.simplex.noise2D( 0.9, this.time / 100 );

	this.random = Math.random();
}

module.exports = Controller;