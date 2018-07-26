var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;

var DomLayer = function( options, projectList ) {
	this.options = options || {};
	this.node = document.getElementById('domLayer');

	this.menuNode = document.getElementById('menu');
	this.menuBBS = this.node.getElementsByClassName('svgbb');
	this.menuTXTS = this.node.getElementsByClassName('svgtxt');
	this.overlays = this.node.getElementsByClassName('overlay');
	
	for( var i = 0 ; i < this.menuBBS.length ; i++ ) this.menuBBS[ i ].addEventListener( 'mouseenter', this.bbEnter.bind( this ) ); 
	for( var i = 0 ; i < this.menuBBS.length ; i++ ) this.menuBBS[ i ].addEventListener( 'mouseleave', this.bbLeave.bind( this ) ); 
	
	document.getElementById('6D61696C746F3A').addEventListener('click', this.openMl.bind(this) );

	for( var i = 0 ; i < projectList.length; i++ ) this.addProject( projectList[i] );
	var links = this.node.getElementsByClassName('project');
	for( var i = 0 ; i < links.length ; i++ ) links[i].addEventListener( 'mouseenter', this.linkEnter.bind( this ) );
	for( var i = 0 ; i < links.length ; i++ ) links[i].addEventListener( 'mouseleave', this.linkLeave.bind( this ) );
	for( var i = 0 ; i < links.length ; i++ ) links[i].addEventListener( 'mousedown', this.linkClick.bind( this ) );

}

inherits( DomLayer, EventEmitter );

DomLayer.prototype.openMl = function( ){
	var s = '', h = [ '6D61696C746F3A', '73616E74694070726F7065722D636F64652E636F6D'];
	for (var i = 0; i < h[0].length; i += 2) s += String.fromCharCode(parseInt(h[0].substr(i, 2), 16));
	for (var i = 0; i < h[1].length; i += 2) s += String.fromCharCode(parseInt(h[1].substr(i, 2), 16));
	location.href = s;
}

DomLayer.prototype.resize = function( dims ) {
	var margin = 10;
	var menuDims = [ parseInt(this.menuNode.getAttribute( 'width' ) ), parseInt(this.menuNode.getAttribute( 'height' ) ) ];
	var menuAR = menuDims[1] / menuDims[0];
	var screenAR = ( dims.height - margin * 2 ) / ( dims.width - margin * 2 );
	
	var scale;
	if( screenAR > menuAR ) scale = ( dims.width - margin * 2 ) / menuDims[0];
	else scale = ( dims.height - margin * 2 ) / menuDims[1];

	var offset = [ ( ( dims.width - margin * 2 ) - menuDims[0] * scale ) / 2 + margin, ( ( dims.height - margin * 2 ) - menuDims[1] * scale ) / 2 + margin ];
	this.menuNode.style.transform = 'translate3d( ' + offset[0] + 'px, ' + offset[1] + 'px, 0px ) scale(' + scale + ')';

	this.node.classList.add( 'ready' );
};

DomLayer.prototype.addProject = function( project ){
	var projectList = document.getElementById('projectList');
	var link = document.createElement( 'a' );
	link.dataset.colorScheme = project.colorScheme;
	link.setAttribute( 'href', 'javascript:void(0);' );
	link.dataset.id = project.id;
	link.classList.add('project')
	link.classList.add('innerOverlay')
	
	link.innerHTML = project.title;
	projectList.childNodes[0].appendChild( link );
	projectList.childNodes[0].innerHTML += '<br>';
}

DomLayer.prototype.bbEnter = function( e ){
	for( var i = 0 ; i < this.overlays.length ; i++ ) this.overlays[ i ].classList.remove('active');
	for( var i = 0 ; i < this.menuTXTS.length ; i++ ) this.menuTXTS[ i ].classList.add('active');
	var bb = e.currentTarget;
	bb.previousSibling.classList.remove('active');
	var node = document.getElementById( bb.dataset.trigger );
	node.classList.add( 'active' );
}

DomLayer.prototype.bbLeave = function( e ){
	if( e.toElement &&e.toElement.classList.contains( 'innerOverlay' ) ) return;
	var bb = e.currentTarget;
	bb.previousSibling.classList.add('active');
	var node = document.getElementById( bb.dataset.trigger );
	node.classList.remove( 'active' );
}

DomLayer.prototype.linkEnter = function( e ){
	this.emit( 'projectEnter', e.target.dataset.id );
}

DomLayer.prototype.linkLeave = function( e ){
	this.emit( 'projectLeave', e.target.dataset.id );
}

DomLayer.prototype.linkClick = function( e ){
	this.emit( 'projectClick', e.target.dataset.id );
}

DomLayer.prototype.aboutEnter = function( e ){
	this.emit( 'aboutEnter', e.target.dataset.id );
	this.node.classList.add('about');
}

DomLayer.prototype.aboutLeave = function( e ){
	this.emit( 'aboutLeave', e.target.dataset.id );
	this.node.classList.remove('about');
}

DomLayer.prototype.showClick = function( e ){};

DomLayer.prototype.mouseMove = function( x, y ){};

DomLayer.prototype.resizeEnd = function(){};

DomLayer.prototype.step = function( time ) {};

module.exports = DomLayer;