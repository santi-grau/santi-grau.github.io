var Projects = require('./Projects');
var domify = require( 'domify' );
var Img = require('./Img-module');
var Video = require('./Video-module');
var Youtube = require('./Youtube-module');
var Preloader = require('./Preloader');
var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;
var ProjectLayerDom = require('./projectLayer.pug');

var ProjectLayer = function( project ){
	this.project = project;
	this.mods = [];
	this.modsReady = 0;

	this.node =  domify( ProjectLayerDom( ) );

	document.body.appendChild( this.node );

	this.preloader = new Preloader();

	this.closeBut = document.getElementById('closebut');
	this.closeBut.addEventListener( 'mousedown', this.close.bind(this) );

	this.modulesContainer = document.getElementById('modulesContainer');
	this.leftCol = document.getElementById('modulesLeft');
	this.rightCol = document.getElementById('modulesRight');

	this.infoNode = domify( Projects[ project ].info( ) );
	this.node.appendChild( this.infoNode );

	this.loadMod();
}

inherits( ProjectLayer, EventEmitter );

ProjectLayer.prototype.loadMod = function( ){
	// console.log( Projects[ this.project ].assets.length, this.modsReady )
	var asset = Projects[ this.project ].assets[ this.modsReady ];
	var node = document.createElement('div');
	node.classList.add( 'module', asset.type );
	if( asset.col == 1 ) this.leftCol.appendChild( node );
	else if( asset.col == 2 ) this.rightCol.appendChild( node );
	else this.leftCol.appendChild( node );
	var Src = asset.src;
	if( asset.type == 'image' ) this.mods.push( new Img( asset.src, asset.size, node, this.modsReady ) );
	if( asset.type == 'video' ) this.mods.push( new Video( asset.src, node ) );
	if( asset.type == 'code' ) {
		this.mods.push( new Src( node, asset.params ) );
		this.modLoaded();
	}
	if( asset.type == 'youtube' ) {
		this.mods.push( new Youtube( asset.src, asset.params, asset.dims, this.project, node ) );
		this.modLoaded();
	}
	if( asset.type !== 'code' && asset.type !== 'youtube' ) this.mods[this.modsReady].on('loaded', this.modLoaded.bind(this) );
}

ProjectLayer.prototype.modLoaded = function( ){
	this.modsReady++;
	this.preloader.update( this.modsReady / Projects[this.project].assets.length );
	if( this.modsReady == Projects[this.project].assets.length ) this.ready();
	else this.loadMod();
}

ProjectLayer.prototype.resize = function( dims ){
	for( var i = 0 ; i < this.mods.length ; i++ ) if( this.mods[i].resize ) this.mods[i].resize();
}

ProjectLayer.prototype.scrolling = function( ){}

ProjectLayer.prototype.ready = function( ){
	this.resize();
	this.emit('loaded');
}

ProjectLayer.prototype.close = function( project ){
	this.emit( 'close' );
	this.node.parentNode.removeChild( this.node );
}

ProjectLayer.prototype.step = function( time ){
	for( var i = 0 ; i < this.mods.length ; i++ ) if( this.mods[i].step ) this.mods[i].step();
	this.preloader.step( time );
}

module.exports = ProjectLayer;