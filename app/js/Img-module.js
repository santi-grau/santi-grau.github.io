var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;
var work = require('webworkify');

var Img = function( src, size, node, id ){
	this.size = size;
	this.node = node;
	this.type = 'image';
	

	var w = work(require('./ImageLoad.js'));
	w.addEventListener('message', function (ev) {
		this.img = new Image();
		this.img.crossOrigin = 'Anonymous';
		this.img.addEventListener('load', this.loaded.bind( this ), false);
		this.img.src = ev.data.url;
	}.bind(this));
	w.postMessage( window._PATH_ + src);
}

inherits( Img, EventEmitter );

Img.prototype.loaded = function( e ){
	this.node.appendChild( e.target );
	this.emit('loaded');
}

module.exports = Img;