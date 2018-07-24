window._PATH_ = 'http://localhost:5000/img/';
if( !window.location.href.includes('localhost') ) window._PATH_ = 'https://portfolio-sg-2018.s3.amazonaws.com/';

var isMobile = navigator.userAgent.match(/(iPhone|Android|BlackBerry)/);
if( isMobile ) document.body.classList.add('mobile');

window.THREE = require('three');
var ThreeLayer = require('./ThreeLayer');
var DomLayer = require('./DomLayer');
var Projects = require('./Projects');
var ProjectLayer = require('./ProjectLayer');

var Intro = require('./Intro');

var Main = function( ) {
	this.node = document.getElementById('main');

	document.getElementById('6D61696C746F3A').addEventListener('click', this.openMl.bind(this) );
	if( isMobile ) return;
	
	var obs = [];
	for ( var project in Projects ) obs.push( project );
	this.active = String( obs[ Math.floor( Math.random() * obs.length ) - 1 ] );

	this.threeLayer = new ThreeLayer( { } );

	this.projects = Projects;
	var instanceQueue = []
	for ( var project in this.projects ) instanceQueue.push( { id : project, preview : this.projects[ project ].preview } );
	this.intro = new Intro( { }, instanceQueue, { x : 0, y : 0, width : this.node.offsetWidth, height : this.node.offsetHeight }, this.threeLayer.renderer );
	this.intro.on( 'introLoaded', this.introLoaded.bind( this ) );

	var projectList = [];
	for ( var project in this.projects ) projectList.push( { id : project, title : this.projects[ project ].title, colorScheme : this.projects[ project ].colorScheme } );
	this.domLayer = new DomLayer( { }, projectList );

	window.addEventListener( 'resize', this.resize.bind( this ) );
	window.addEventListener( 'mousemove', this.mouseMove.bind( this ) );
	window.addEventListener( 'scroll', this.scroll.bind( this ) );
}

Main.prototype.projectEnter = function( project ){
	if( this.active == project ) return;
	if( Projects[ project ].colorScheme == 1 ) document.body.classList.add( 'colorInvert' );
	else document.body.classList.remove( 'colorInvert' );
	this.active = project;
	this.threeLayer.preview = this.intro.objs[this.active];
	this.intro.setActive( this.active );
}

Main.prototype.openMl = function( ){
	var s = '', h = [ '6D61696C746F3A', '73616E74694070726F7065722D636F64652E636F6D'];
	for (var i = 0; i < h[0].length; i += 2) s += String.fromCharCode(parseInt(h[0].substr(i, 2), 16));
	for (var i = 0; i < h[1].length; i += 2) s += String.fromCharCode(parseInt(h[1].substr(i, 2), 16));
	location.href = s;
}

Main.prototype.scroll = function( e ){
	var scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	var val = 1 - Math.max( 0, this.node.offsetHeight - scroll ) / this.node.offsetHeight;
	this.threeLayer.node.style.opacity = 1 - ( 1 * val );

	// this.threeLayer.node.style.transform = 'scale(' + ( 1 - val * 0.2 ) + ', ' + ( 1 - val * 0.2 ) + ')' ;
	
	this.projectLayer.preloader.node.style.opacity = 0;
	this.projectLayer.scrolling();
	if( val >= 1 ) this.threeLayer.active = false;
	else this.threeLayer.active = true;
}

Main.prototype.projectClick = function( project ){
	this.node.classList.add( 'project' );
	this.projectLayer = new ProjectLayer( project );
	this.projectLayer.on( 'close', this.closeProject.bind(this) );
	this.projectLayer.on( 'loaded', this.projectLoaded.bind(this) );
	this.threeLayer.node.style.opacity = 1;
	window.location.hash = project;
}

Main.prototype.projectLoaded = function(){
	document.body.classList.add( 'projectLoaded' );
}

Main.prototype.closeProject = function(){
	this.node.classList.remove( 'project' );
	document.body.classList.remove( 'projectLoaded' );
	this.projectLayer = null;
	this.threeLayer.node.style.opacity = 1;
	this.threeLayer.active = true;
	window.location = '#';
}

Main.prototype.introLoaded = function( ){
	this.intro.setActive( this.active );
	this.threeLayer.preview = this.intro.objs[this.active];
	
	if( Projects[ this.active ].colorScheme == 1 ) document.body.classList.add( 'colorInvert' );
	else document.body.classList.remove( 'colorInvert' );

	this.domLayer.on( 'projectEnter', this.projectEnter.bind( this ) );
	this.domLayer.on( 'projectClick', this.projectClick.bind( this ) );

	this.resize();
	this.step();

	var loc = window.location.hash.substr(1);
	if( loc ) {
		this.projectEnter( loc );
		this.projectClick( loc );
	}
}

Main.prototype.mouseMove = function( e ){
	this.domLayer.mouseMove( e.clientX, e.clientY );
	this.intro.mouseMove( e.clientX / this.node.offsetWidth, e.clientY / this.node.offsetHeight );
}

Main.prototype.resize = function( e ) {
	this.domLayer.resize( { x : 0, y : 0, width : this.node.offsetWidth, height : this.node.offsetHeight } )
	this.intro.resize( { x : 0, y : 0, width : this.node.offsetWidth, height : this.node.offsetHeight } )
	this.threeLayer.resize( { x : 0, y : 0, width : this.node.offsetWidth, height : this.node.offsetHeight } );
	if( this.projectLayer ) this.projectLayer.resize( { x : 0, y : 0, width : this.node.offsetWidth, height : this.node.offsetHeight } );
}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	this.intro.step( time );
	this.threeLayer.step( time );
	if( this.projectLayer ) this.projectLayer.step( time );
};

window._root_ = new Main();