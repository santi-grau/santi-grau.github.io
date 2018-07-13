var paths = require('./letters.svg');

var Letters = function( node, params ){
	this.node = node;
	this.type = 'code';

	this.node.style.backgroundColor = '#000000';

	var ls = [ 'w', 'd', 'c' ];
	this.time = Math.random();
	this.timeInc = 0.01;

	var parser = new DOMParser();
	this.svg = parser.parseFromString( paths, "image/svg+xml" ).getElementsByTagName('svg')[0];
	
	var groups = this.svg.getElementsByTagName('g');

	this.group = groups[ ls.indexOf( params.letter ) ].getElementsByTagName('path');

	this.node.appendChild( this.svg );
	this.resize( null );
	this.ready = true;

	this.time = Math.random() * 10;
	this.update();
	this.img = new Image();
	var xml = new XMLSerializer().serializeToString(this.svg);
	var svg64 = btoa(xml);
	var b64Start = 'data:image/svg+xml;base64,';
	var image64 = b64Start + svg64;
	this.img.src = image64;
}

Letters.prototype.resize = function( ){
	var svgW = parseInt( this.svg.getAttribute('width') );
	var svgH = parseInt( this.svg.getAttribute('height') );

	var svgAR = svgH / svgW;
	var nodeAR = this.node.offsetHeight / this.node.offsetWidth;

	if( nodeAR > svgAR ) {
		this.svg.setAttribute( 'width', this.node.offsetWidth )
		this.svg.setAttribute( 'height', this.node.offsetWidth * nodeAR )
	} else {
		this.svg.setAttribute( 'height', this.node.offsetHeight )
		this.svg.setAttribute( 'width', this.node.offsetHeight / nodeAR )
	}
}

Letters.prototype.update = function(){
	var l = this.group.length;
	var v = Math.abs( Math.sin( Math.PI * 2 * this.time ) ) * l;
	for( var i = 0 ; i < l ; i++ ){
		var g = this.group[ i ];
		var vs = Math.min( v - i, 1 );
		if( v > i ) this.group[ i ].setAttribute('opacity', vs );
		else this.group[ i ].setAttribute('opacity', '0' );
	}
}

Letters.prototype.step = function( time ){
	this.time += this.timeInc;
	this.update();
	
}

module.exports = Letters;