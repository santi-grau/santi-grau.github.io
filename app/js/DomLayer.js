var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;


var DomLayer = function( options, projectList ) {
	this.options = options || {};
	this.node = document.getElementById('domLayer');

	this.projects = projectList;

	this.spacer1 = document.getElementById('spacer1');
	this.spacer2 = document.getElementById('spacer2');
	this.projectList = document.getElementById('projectList');
	this.cont = this.node.getElementsByClassName('cont')[0];

	document.getElementById('6D61696C746F3A').addEventListener('click', this.openMl.bind(this) );

	for( var i = 0 ; i < projectList.length; i++ ) this.addProject( projectList[i], i, projectList.length );
	
	var links = this.node.getElementsByClassName('project');
	
	if( isMobile ) for( var i = 0 ; i < 4 ; i++ ) this.node.appendChild( this.cont.cloneNode(true) );
	
	var l = this.node.getElementsByClassName('project');
	for( var i = 0 ; i < l.length ; i++ ) l[i].addEventListener( 'mouseenter', this.linkEnter.bind( this ) );
	for( var i = 0 ; i < l.length ; i++ ) l[i].addEventListener( 'mouseleave', this.linkLeave.bind( this ) );
	for( var i = 0 ; i < l.length ; i++ ) l[i].addEventListener( 'mousedown', this.linkClick.bind( this ) );

	if( !isMobile ) return;

	this.conts = this.node.getElementsByClassName('cont');

	var offset = this.node.offsetHeight - 100;
	this.previousScroll = offset;
	this.node.parentNode.scrollTo ( 0, offset );
}

inherits( DomLayer, EventEmitter );

DomLayer.prototype.scrolling = function( e ){
	var dir = 1;
	if( this.previousScroll > e ) dir = -1;
	
	if( dir > 0 ){
		for( var i = 0 ; i < this.conts.length ; i++ ) if( this.conts[i].getBoundingClientRect().bottom < 0 ) this.node.appendChild( this.conts[i] );
	}

	if( dir < 0 ){
		for( var i = 0 ; i < this.conts.length ; i++ ) if( this.conts[i].getBoundingClientRect().top > this.node.offsetHeight ) this.node.prepend( this.conts[i] );
	}

	var c = this.node.getElementsByClassName('cont');
	
	var d = -100000;
	var id = 0;

	for( var i = 0 ; i < c.length ; i++ ){
		var t = c[ i ].getBoundingClientRect().top;
		if( t < 0 && t > d ){
			d = t;
			id = i;
		}
	}

	var sel = Math.min( Math.max( 0, Math.round( -d / c[id].offsetHeight * ( this.projects.length - 1 ) ) ), this.projects.length - 1 );
	
	this.emit( 'projectEnter', this.projects[ sel ].id );

	var p = this.node.getElementsByClassName('project');
	var pa = this.node.getElementsByClassName('p-'+this.projects[ sel ].id);
	for( var i = 0 ; i < p.length ; i++ ) p[i].classList.remove('active');
	for( var i = 0 ; i < pa.length ; i++ ) pa[i].classList.add('active');

	this.previousScroll = e;
}

DomLayer.prototype.openMl = function( ){
	var s = '', h = [ '6D61696C746F3A', '73616E74694070726F7065722D636F64652E636F6D'];
	for (var i = 0; i < h[0].length; i += 2) s += String.fromCharCode(parseInt(h[0].substr(i, 2), 16));
	for (var i = 0; i < h[1].length; i += 2) s += String.fromCharCode(parseInt(h[1].substr(i, 2), 16));
	location.href = s;
}

DomLayer.prototype.resize = function( dims ) {
	var lineMargin = 3;
	this.spacer1.innerHTML = '&nbsp;';
	var lHeight = this.spacer1.parentNode.offsetHeight;
	
	var introHeight = document.getElementById('intro').offsetHeight / lHeight;
	var pHeight = Math.floor( this.projectList.offsetHeight / lHeight );
	var contactHeight = document.getElementById('contact').offsetHeight / lHeight;
	
	this.spacer1.innerHTML = '';
	this.spacer2.innerHTML = '';

	var lines = Math.floor( this.node.offsetHeight / lHeight );

	var linesBefore = Math.floor( ( lines - lineMargin - pHeight ) / 2 );
	var linesToAddBefore = Math.max( linesBefore - introHeight, 1 );
	if( isMobile ) linesToAddBefore = 1;
	for( var i =  0; i < linesToAddBefore; i++ ){
		if( i > 0 ) this.spacer1.innerHTML += '<br>';
		this.spacer1.innerHTML += '&nbsp;';
	}

	var linesToAddAfter = Math.max( 1, lines - lineMargin - ( contactHeight + linesToAddBefore + introHeight + pHeight ) );
	if( isMobile ) linesToAddAfter = 1;
	for( var i = 0; i < linesToAddAfter; i++ ){
		if( i > 0 ) this.spacer2.innerHTML += '<br>';
		this.spacer2.innerHTML += '&nbsp;';
	}
	if( linesToAddAfter == 1 ) this.spacer2.innerHTML += '<br>';

	this.node.classList.add( 'ready' );
};

DomLayer.prototype.addProject = function( project, index, length ){
	var link = document.createElement( 'a' );
	var id = project.id
	link.dataset.colorScheme = project.colorScheme;
	link.setAttribute( 'href', '/#' + id );
	link.dataset.id = id;
	link.classList.add('project')
	link.classList.add('p-'+id)
	link.classList.add('innerOverlay')
	link.innerHTML = project.title;
	this.projectList.appendChild( link );
	if( index < length - 1 ) this.projectList.innerHTML += '<br>';
}

DomLayer.prototype.linkEnter = function( e ){
	this.emit( 'projectEnter', e.target.dataset.id );
}

DomLayer.prototype.linkLeave = function( e ){
	this.emit( 'projectLeave', e.target.dataset.id );
}

DomLayer.prototype.linkClick = function( e ){
	window.location.hash = e.target.dataset.id;
	if( window.ga ) ga('send', 'pageview', e.target.dataset.id );
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