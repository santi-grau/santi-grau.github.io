var geoWorker = require('webworkify')( require( './geometry' ) );
var Letter = require('./Letter');

var LetterScene = function(){
	THREE.Scene.apply(this, arguments);

	this.group = new THREE.Object3D();
	this.add( this.group );

	this.rotationGroup = new THREE.Object3D();
	this.group.add( this.rotationGroup );

	this.scaleGroup = new THREE.Object3D();
	this.rotationGroup.add( this.scaleGroup );
	this.scaleGroup.scale.set( 0.5, 0.5, 0.5 );

	this.groups = new DOMParser().parseFromString( require('./src.svg'), "application/xml").getElementsByTagName('svg')[0].getElementsByTagName('g');
	
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
}

LetterScene.prototype = Object.create(THREE.Scene.prototype);
LetterScene.prototype.constructor = LetterScene;

LetterScene.prototype.switchLetter = function( l ){
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	if( !l ) l = possible.charAt(Math.floor(Math.random() * possible.length));

	clearInterval( this.switchInterval );

	var exists = false;
	this.scaleGroup.children.forEach( function( letter ){ if( letter.name == l ) exists = true });
	if( this.rotationGroup.rotation.y !== 0 || !exists ) return;

	
	TweenLite.to( this.rotationGroup.rotation, 0.6, { y : -Math.PI * 2, ease : Power4.easeOut, onComplete : function(){
		this.rotationGroup.rotation.y = 0;
	}.bind( this ) } );

	this.scaleGroup.children.forEach( function( letter ) {
		if( letter.visible ) letter.visible = false;
		if( letter.name == l ) letter.visible = true;
	})
}

LetterScene.prototype.geometryReady = function( e ){
	var data = JSON.parse( e.data );
	
	for (var letter in data ) this.scaleGroup.add( new Letter( data[ letter ], letter ) );
	this.scaleGroup.children[0].visible = true;
	
	if( this.scaleGroup.children.length == 1 ){
		document.getElementById('disclaimer').classList.add( 'active' );
		var letters = {};
		for( var i = 0 ; i < this.groups.length ; i++ ) {
			var lId = this.groups[ i ].getAttribute('id');
			if( lId == 'image' || lId == this.scaleGroup.children[0].name ) continue;
			letters[ lId ] = {};
			var shapes = this.groups[ i ].getElementsByTagName('path');
			for( var j = 0 ; j < shapes.length ; j++ ){
				letters[ lId ][ shapes[ j ].getAttribute('id') ] = {
					path : shapes[ j ].getAttribute('d'),
					props : {
						matId : shapes[ j ].getAttribute('id').split('_')[ 0 ].replace(/[0-9]/g, ''),
						fill : shapes[ j ].style.fill
					}
				}
			}
		}
		geoWorker.postMessage( JSON.stringify( { letters : letters , url : document.location.protocol + '//' + document.location.host } ) );
	} else {
		this.switchInterval = setInterval( this.switchLetter.bind( this ), 4000 );
	}
}

LetterScene.prototype.resize = function( width, height ){
	
}

LetterScene.prototype.step = function( time ){
	this.scaleGroup.children.forEach( function( letter ) { if( letter.visible ) letter.step( time ); });
}

module.exports = LetterScene;