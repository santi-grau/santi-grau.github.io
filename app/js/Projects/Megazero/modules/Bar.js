var SimplexNoise = require( 'simplex-noise' );

var Bar = function( geo, id, props ){
	THREE.Object3D.apply(this, arguments);

	this.minDepth = 305;
	this.time = 0;
	this.timeInc = 0.001;
	this.seed = Math.random();
	this.noiseSeed = new THREE.Vector2( Math.random(), Math.random() );

	geo.computeBoundingBox();
	var material = new THREE.MeshBasicMaterial( { wireframe : true, color : 0xffffff } );
	
	this.simplex = new SimplexNoise( Math.random );

	var color = new THREE.Vector3( 0, 0, 0 );
	var fill = props.fill;
	if( fill !== 'none' ){
		var rgb = fill.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		var color = new THREE.Vector3( rgb [1] / 255, rgb [2] / 255, rgb [3] / 255 );
	}

	var material = new THREE.ShaderMaterial({
		uniforms : {
			col : { value : color },
			seed : { value : this.noiseSeed }
		},
		vertexShader: require('./../shaders/static.vs'), 
		fragmentShader: require('./../shaders/static.fs')
	});

	var mesh = new THREE.Mesh( geo, material );

	this.name = id;
	this.add( mesh );
}

Bar.prototype = Object.create(THREE.Object3D.prototype);
Bar.prototype.constructor = Bar;

Bar.prototype.step = function( time ){
	this.time += this.timeInc;

	var n = ( this.simplex.noise2D( this.seed, this.time ) + 1 ) / 2;
	this.children[ 0 ].scale.z = this.minDepth + n * 25;
	this.children[ 0 ].position.z = -this.children[ 0 ].scale.z / 2 + ( this.children[ 0 ].scale.z - 300 ) / 2;

	this.children[ 0 ].material.uniforms.seed.value = new THREE.Vector2( this.noiseSeed.x + this.time, this.noiseSeed.y + n );	
}

module.exports = Bar;