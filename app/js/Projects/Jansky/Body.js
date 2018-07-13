var Letters = require('./Letters');
var SimplexNoise = require('simplex-noise');
var Gsap = require('gsap');

var Body = function( controller, settings ){
	THREE.Object3D.apply(this, arguments);
	this.controller = controller;

	this.time = 0;
	this.timeInc = 1;

	this.controller.on( 'beat', this.beat.bind( this ) );
	this.controller.on( 'bar', this.bar.bind( this ) );
	this.controller.on( 'fourbar', this.fourbar.bind( this ) );


	this.settings = settings || {};

	this.simplex = new SimplexNoise( Math.random );

	// this.rotationStatus = new THREE.Vector3( Math.round( Math.random() ) * 2 - 1 , Boolean( Math.round( Math.random() ) ), Math.floor( Math.random() * 3 ) ); // direction, active, type --> 0 Beat | 1 bar | 4 fourbar
	this.wordStatus = Math.random();

	this.track = new THREE.Vector4( 0, 50 + Math.random() * 450, 0, 0 ); // value, divisor, count, mode -> 0 fluid | 1 step | 2 random
	this.height = new THREE.Vector4( 0, 50 + Math.random() * 450, 0, 0 );
	this.offset = new THREE.Vector4( 0, 50 + Math.random() * 450, 0, 0 );
	
	var width = document.body.offsetWidth;
	var height = this.settings.fontSize;
	this.letters = new Letters( width * 2, height * 4, { fontSize : this.settings.fontSize } ); // THREE.WebGLRenderTarget
	this.letters.updateWord( this.settings.word );

	this.rows = 40;
	this.rowCount = 8;
	this.sides = 8;

	var geometry = new THREE.PlaneBufferGeometry( 1, height );
	var material = new THREE.MeshBasicMaterial( { map : this.letters.texture, transparent : true } );

	for( var h = 0 ; h < this.sides + 1 ; h++ ){
		var group = new THREE.Object3D();
		for( var i = 0 ; i < this.rows + 1 ; i++ ){
			var plane = new THREE.Mesh( geometry, material );
			if( i > this.rowCount ) plane.visible = false;
			group.add( plane );
			plane.position.y = 200;
		}
		group.rotation.z = h / this.sides * Math.PI * 2;
		this.add( group );
	}

	this.beat();
	this.bar();
	this.fourbar();

	this.resize( width, height );
}

Body.prototype = Object.create(THREE.Object3D.prototype);
Body.prototype.constructor = Body;

Body.prototype.beat = function( ){
	if( this.track.w == 1 ) this.letters.updateTrack( this.track.x );
	if( this.height.w == 1 ) this.updateLineHeight( this.height.x );
	if( this.offset.w == 1 ) this.updateLineOffset( this.offset.x );

	if( this.track.w == 2 ) this.letters.updateTrack( Math.random() * 2 - 1 );
	if( this.height.w == 2 ) this.updateLineHeight( Math.random() * 2 - 1 );
	if( this.offset.w == 2 ) this.updateLineOffset( Math.random() * 2 - 1 );
}

Body.prototype.bar = function( ){
	
}

Body.prototype.fourbar = function( ){
	
	this.wordStatus = Math.random();

	if( this.track.w == 2 ) this.track.y = 50 + Math.random() * 450;
	if( this.height.w == 2 ) this.height.y = 50 + Math.random() * 450;
	if( this.offset.w == 2 ) this.offset.y = 50 + Math.random() * 450;

	this.track.w = Math.floor( Math.random() * 3 );
	this.height.w = Math.floor( Math.random() * 3 );
	this.offset.w = Math.floor( Math.random() * 3 );

}

Body.prototype.resize = function( width, height ){
	this.letters.resize( width, height );
	var c = this.children;
	for( var i = 0 ; i < c.length ; i++ ) for( var j = 0 ; j < c[i].children.length ; j++ ) c[i].children[ j ].scale.x = width;
}

Body.prototype.updateWord = function( string ){
	this.letters.updateWord( string );
}

Body.prototype.updateLineHeight = function( n ){
	var c = this.children;
	for( var i = 0 ; i < c.length ; i++ ) for( var j = 0 ; j < c[i].children.length ; j++ ) c[i].children[ j ].position.y = 200 - j * ( n * 30 );
}

Body.prototype.updateLineOffset = function( n ){
	var c = this.children;
	for( var i = 0 ; i < c.length ; i++ ) for( var j = 0 ; j < c[i].children.length ; j++ ) c[i].children[ j ].position.x = j * ( n * 5 );
}

Body.prototype.step = function( time, renderer ){
	renderer.render( this.letters.scene, this.letters.camera, this.letters, true );
	this.time += this.timeInc;

	this.track.x = this.simplex.noise3D( 0.9, 0.3, this.time / this.track.y );
	this.height.x = this.simplex.noise3D( 0.3, 0.2, this.time / this.height.y );
	this.offset.x = this.simplex.noise3D( 0.1, 0.8, this.time / this.offset.y );

	if( this.track.w == 0 ) this.letters.updateTrack( this.track.x );
	if( this.height.w == 0 ) this.updateLineHeight( this.height.x );
	if( this.offset.w == 0 ) this.updateLineOffset( this.offset.x );

	var words = 8;
	if( this.wordStatus > 0.8 ) words = 8 + Math.floor( this.controller.beatPeak * ( this.rows - this.rowCount ) );
	
	for( var h = 0 ; h < this.sides + 1 ; h++ ){
		for( var i = 8 ; i < words ; i++ ) this.children[h].children[i].visible = true;
		for( var i = words ; i < this.rows ; i++ ) this.children[h].children[i].visible = false;
	}
}

module.exports = Body;