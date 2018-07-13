// var EventEmitter = require('events').EventEmitter;
// var inherits = require( 'util' ).inherits;

var Youtube = function( src, params, dims, project, node, id ){
	this.params = params || null;
	this.dims = dims;
	this.node = node;

	this.wrapper = document.createElement('div');
	this.wrapper.classList.add( 'wrapper' );
	this.node.appendChild( this.wrapper );
	
	this.resize();

	this.player = new YT.Player( this.wrapper, {
		videoId: src,
		playerVars: { 'autoplay': 1, 'controls': 0, 'modestbranding' : 0, 'rel' : 0, 'showinfo' : 0, origin : 'http://localhost:5000' },
		events: {
			'onReady' : this.videoReady.bind(this)
		}
	});
}

// inherits( Youtube, EventEmitter );

Youtube.prototype.resize = function( ){
	var ar = this.dims[ 1 ] / this.dims[ 0 ];
	this.node.style.height = this.node.offsetWidth * ar + 'px';
}

Youtube.prototype.videoReady = function( e ){
	// if( !this.ready ) this.emit('loaded');
	if( this.params ) this.player.seekTo( this.params[0] );
	this.ready = true;
	this.player.setVolume( 0 );
}

Youtube.prototype.step = function(){
	if( this.ready ){
		if( this.params ) {
			if( this.player.getCurrentTime( ) + 0.1 > this.end ) this.player.seekTo( this.start );
		}else {
			if( this.player.getCurrentTime( ) + 0.1 > this.player.getDuration() ) this.player.seekTo( 0 );
		}
	}
}

module.exports = Youtube;