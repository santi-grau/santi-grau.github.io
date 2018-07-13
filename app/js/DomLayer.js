var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;

var DomLayer = function( options, projectList ) {
	this.options = options || {};
	this.node = document.getElementById('domLayer');
	
	// add projects to porjectList and add eventListeners
	for( var i = 0 ; i < projectList.length; i++ ) this.addProject( projectList[i] );
	var links = this.node.getElementsByClassName('project');
	var aboutBut = document.getElementById('aboutBut')
	for( var i = 0 ; i < links.length ; i++ ) links[i].addEventListener( 'mouseenter', this.linkEnter.bind( this ) );
	for( var i = 0 ; i < links.length ; i++ ) links[i].addEventListener( 'mouseleave', this.linkLeave.bind( this ) );
	for( var i = 0 ; i < links.length ; i++ ) links[i].addEventListener( 'mousedown', this.linkClick.bind( this ) );
	aboutBut.addEventListener('mouseenter', this.aboutEnter.bind( this ) );
	aboutBut.addEventListener('mouseleave', this.aboutLeave.bind( this ) );
}

inherits( DomLayer, EventEmitter );

DomLayer.prototype.resize = function( dims ) {
	
};

DomLayer.prototype.addProject = function( project ){
	var projectList = document.getElementById('projectList');
	var link = document.createElement( 'a' );
	link.dataset.colorScheme = project.colorScheme;
	link.setAttribute( 'href', 'javascript:void(0);' );
	link.dataset.id = project.id;
	link.classList.add('project')
	link.innerHTML = project.title;
	projectList.appendChild( link );
	projectList.innerHTML += '<br>';
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