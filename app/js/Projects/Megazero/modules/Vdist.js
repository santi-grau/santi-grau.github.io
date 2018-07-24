var SimplexNoise = require( 'simplex-noise' );

var Vdist = function( geo, id, props ){
	THREE.Object3D.apply(this, arguments);

	this.simplex = new SimplexNoise( Math.random );

	this.geo = geo;
	this.name = id;
	
	this.time = 0;
	this.timeInc = 0.01;

	geo.computeBoundingBox();
	
	var varw = 40;
	this.rows = 2 + Math.floor( Math.random() * 2 );
	this.rows = 2 ;

	this.max = geo.boundingBox.max;
	this.min = geo.boundingBox.min;
	new THREE.Vector2(this.max.x - this.min.x, this.max.y - this.min.y);
	
	this.range = new THREE.Vector2(this.max.x - this.min.x, this.max.y - this.min.y);

	this.cols = Math.round( this.range.x / varw );
	this.barWidth = this.range.x / this.cols;
	this.barHeight = this.range.y / this.rows;
	
	var cCount = 0;
	for( var i = 0 ; i < this.rows; i++ ){
		for( var j = 0 ; j < this.cols ; j++ ){
			var geometry = new THREE.BoxBufferGeometry( this.barWidth, 1, 390 );
			// var material = new THREE.MeshBasicMaterial( { color : 0xffffff } );
			var c =  new THREE.Vector3( 1, 1, 1 );
			
			if( cCount ) {
				// material = new THREE.MeshBasicMaterial( { color : 0x000000 } );
				c = new THREE.Vector3( 0, 0, 0 );
				geometry = new THREE.BoxBufferGeometry( this.barWidth, 1, 340 );
			}
			var material = new THREE.ShaderMaterial({
				uniforms : {
					col : { value : c },
					seed : { value : Math.random() }
				},
				vertexShader: require('./../shaders/static.vs'), 
				fragmentShader: require('./../shaders/static.fs')
			});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.set( this.min.x + this.barWidth * j + this.barWidth * 0.5, this.min.y + this.barHeight * i + this.barHeight * 0.5, 0 );
			this.add( mesh );
			cCount = 1 - cCount;
		}
	}
}

Vdist.prototype = Object.create(THREE.Object3D.prototype);
Vdist.prototype.constructor = Vdist;

Vdist.prototype.updateHeight = function(){
	
	if( this.rows == 2 ){
		var n = ( this.simplex.noise2D( 0.5, this.time ) + 1 ) / 2;
		var n2 =  ( 1 - n );
		for( var i = 0 ; i < this.cols ; i++ ){
			this.children[ i ].scale.y = this.range.y * n;
			this.children[ i ].position.y = this.min.y + ( this.range.y * n ) / 2;
		}

		for( var i = this.cols ; i < this.cols * 2 ; i++ ){
			this.children[ i ].scale.y = this.range.y * n2;
			this.children[ i ].position.y = this.min.y + ( this.range.y * n ) + ( this.range.y * n2 ) / 2;
		}
	}

	if( this.rows == 3 ){
		var n = ( this.simplex.noise2D( 0.5, this.time ) + 1 ) / 2;
		var n2 = ( ( this.simplex.noise2D( 0.1, this.time ) + 1 ) / 2 ) * ( 1 - n );
		var n3 = 1 - ( n + n2 );
		
		for( var i = 0 ; i < this.cols ; i++ ){
			this.children[ i ].scale.y = this.range.y * n;
			this.children[ i ].position.y = this.min.y + ( this.range.y * n ) / 2;
		}

		for( var i = this.cols ; i < this.cols * 2 ; i++ ){
			this.children[ i ].scale.y = this.range.y * n2;
			this.children[ i ].position.y = this.min.y + ( this.range.y * n ) + ( this.range.y * n2 ) / 2;
		}

		for( var i = this.cols *2 ; i < this.cols * 3 ; i++ ){
			this.children[ i ].scale.y = this.range.y * n3;
			this.children[ i ].position.y = this.min.y + ( this.range.y * n ) + ( this.range.y * n2 ) + ( this.range.y * n3 ) / 2;
		}
		
	}
}

Vdist.prototype.step = function( time ){
	this.time += this.timeInc;

	
	this.updateHeight();
	// this.children[0].material.uniforms.time.value = this.time;
}

module.exports = Vdist;