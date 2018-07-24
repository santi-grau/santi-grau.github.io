var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;

var Intro = function( options, instanceQueue, dims, renderer ) {
	this.options = options || {};
	this.dims = dims;
	this.renderer = renderer;

	this.mouse = { x : 0, y : 0 };

	this.objs = {};
	this.addProject( instanceQueue );
}

inherits( Intro, EventEmitter );

Intro.prototype.addProject = function( instanceQueue ){
	var project = instanceQueue.shift();

	this.objs[ project.id ] = new project.preview( this.dims, this.renderer );
	if( this.objs[project.id].on ) this.objs[ project.id ].on( 'ready', this.projectReady.bind( this, instanceQueue, project.id ) );
	else this.projectReady( instanceQueue, project.id );
}

Intro.prototype.projectReady = function( instanceQueue, id ){
	this.objs[id].resize( this.dims );
	if( instanceQueue.length ) this.addProject( instanceQueue );
	else this.projectsLoaded();
}

Intro.prototype.projectsLoaded = function( ) {
	this.emit( 'introLoaded' );
}

Intro.prototype.setActive = function( project ){
	if( !this.objs[project] ) return console.log('no project selected');
	this.active = project;
	( this.objs[project].setActive ) && this.objs[project].setActive( this.mouse.x, this.mouse.y, this.dims );
}

Intro.prototype.mouseMove = function( x, y ){
	// if( !this.objs[this.active] ) return console.log('no project selected');
	if( !this.active ) return;
	this.mouse = { x : x, y : y };
	( this.objs[this.active].setMouse ) && this.objs[this.active].setMouse( x, y );
}	

Intro.prototype.resize = function( dims ) {
	for ( var obj in this.objs ) this.objs[ obj ].resize( dims );
}

Intro.prototype.step = function( time ) {
	if( !this.active ) return;
	this.objs[this.active].step( time );
};

module.exports = Intro;