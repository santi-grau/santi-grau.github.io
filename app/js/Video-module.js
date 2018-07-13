var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;

var Video = function( src, node ){
	this.node = node;
	this.type = 'video';

	this.video = document.createElement('video');

	this.video.src = window._PATH_ + src;
	this.video.autoplay = true;
	this.video.setAttribute( 'loop', true );
	this.video.addEventListener( 'loadedmetadata', function( e ){
		this.node.appendChild( this.video );
		this.resize( );
		this.emit('loaded');
	}.bind( this ) );
}

inherits( Video, EventEmitter );

Video.prototype.resize = function(){
	var mw = this.node.offsetWidth, mh = this.node.offsetHeight, moduleAR = mh / mw, videoAR = this.height / this.width, w = mw, h = mh;
	if( videoAR > moduleAR ) {
		this.node.classList.add('containVertical');
		this.node.classList.remove('containHorizontal');
	} else {
		this.node.classList.remove('containVertical');
		this.node.classList.add('containHorizontal');
	}
	if( videoAR > moduleAR ) w = mh / videoAR;
	else h = mw * videoAR;

	var d = { w : w, h : h };
	
}

module.exports = Video;