var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;
var geoWorker = require('webworkify')( require( './geometry' ) );
var Letter = require('./Letter');
var LetterScene = require('./LetterScene');
var Composer = require('./Composer');

var Megazero = function( dims, renderer ){
	this.group = new THREE.Object3D();
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	this.rotationGroup = new THREE.Object3D();
	this.group.add( this.rotationGroup );

	this.scaleGroup = new THREE.Object3D();
	this.rotationGroup.add( this.scaleGroup );
	this.scaleGroup.scale.set( 0.5, 0.5, 0.5 );

	this.groups = new DOMParser().parseFromString( require('./src.svg'), "application/xml").getElementsByTagName('svg')[0].getElementsByTagName('g');
	
	this.postRT = new THREE.WebGLRenderTarget( dims.width * 2, dims.height * 2, {  } );
	this.composer = new Composer( renderer, this.postRT, this.scene, this.camera );

	this.rotation = new THREE.Vector2( 0, 0 );

	var letterIndex = 1 + Math.floor( Math.random() * ( this.groups.length - 1 ) );
	var lId = this.groups[ letterIndex ].getAttribute('id');
	var letters = {};
	letters[ lId ] = {};
	var shapes = this.groups[ lId ].getElementsByTagName('path');
	for( var j = 0 ; j < shapes.length ; j++ ){
		letters[ lId ][ shapes[ j ].getAttribute('id') ] = {
			path : shapes[ j ].getAttribute('d'),
			props : {
				matId : shapes[ j ].getAttribute('id').split('_')[ 0 ].replace(/[0-9]/g, ''),
				fill : shapes[ j ].style.fill
			}
		}
	}
	geoWorker.onmessage = this.geometryReady.bind( this );
	geoWorker.postMessage( JSON.stringify( { letters : letters , url : document.location.protocol + '//' + document.location.host } ) );

	this.scene.add( this.group );
}

inherits( Megazero, EventEmitter );

Megazero.prototype.geometryReady = function( e ){
	var data = JSON.parse( e.data );
	
	for (var letter in data ) this.scaleGroup.add( new Letter( data[ letter ], letter ) );
	this.scaleGroup.children[0].visible = true;

	this.emit( 'ready' );
}

Megazero.prototype.setMouse = function( x, y ){
	this.rotation.x = -( x - 0.5 ) * Math.PI / 6;
	this.rotation.y = -( y - 0.5 ) * Math.PI / 6;
}

Megazero.prototype.resize = function( dims ){
	
	this.dims = dims;
	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Megazero.prototype.step = function( time ){
	this.rotationGroup.rotation.x += ( this.rotation.y - this.rotationGroup.rotation.x ) * 0.1;
	this.rotationGroup.rotation.y += ( this.rotation.x - this.rotationGroup.rotation.y ) * 0.1;
	this.scaleGroup.children.forEach( function( letter ) { if( letter.visible ) letter.step( time ); });
}

Megazero.prototype.render = function( time ){
	this.composer.step( time );
}

module.exports = Megazero;