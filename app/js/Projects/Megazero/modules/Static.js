var SimplexNoise = require( 'simplex-noise' );

var Static = function( geo, id, props ){
	THREE.Object3D.apply(this, arguments);

	this.time = 0;
	this.timeInc = 0.001;
	this.seed = Math.random();
	this.noiseSeed = new THREE.Vector2( Math.random(), Math.random() );

	geo.computeBoundingBox();
	var material = new THREE.MeshBasicMaterial( { wireframe : true, color : 0xffffff } );
	
	this.simplex = new SimplexNoise( Math.random );

	var color = new THREE.Vector3( 0, 0, 0 );
	var fill = props.fill;
	if( fill !== 'none' && fill !== '' && fill !== ' ' ){
		var rgb = fill.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		var color = new THREE.Vector3( rgb [1] / 255, rgb [2] / 255, rgb [3] / 255 );
	}

	this.originalColor = color;

	var material = new THREE.ShaderMaterial({
		uniforms : {
			col : { value : color },
			seed : { value : this.noiseSeed }
		},
		vertexShader: require('./../shaders/static.vs'), 
		fragmentShader: require('./../shaders/static.fs')
	});

	var mesh = new THREE.Mesh( geo, material );

	mesh.scale.z = 340 + Math.random() * 35;
	mesh.position.z = -mesh.scale.z / 2 + ( mesh.scale.z - 300 ) / 2;

	this.name = id;
	this.add( mesh );
}

Static.prototype = Object.create(THREE.Object3D.prototype);
Static.prototype.constructor = Static;

Static.prototype.step = function( time ){
	this.time += this.timeInc;

	var colors = [
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 1, 1, 1 ),
		new THREE.Vector3( 0.98, 0.95, 0.32 ),
		new THREE.Vector3( 0.42, 0.96, 0.96 ),
		new THREE.Vector3( 0.89, 0.24, 0.94 ),
		new THREE.Vector3( 0.89, 0.2, 0.14 ),
		new THREE.Vector3( 0.0, 0.14, 0.96 )
	];

	var n = ( this.simplex.noise2D( this.seed, this.time ) + 1 ) / 2;
	if( n > 0.9 ) this.children[ 0 ].material.uniforms.col.value = colors[ Math.floor( Math.random() * ( colors.length - 1 ) ) ];
	else this.children[ 0 ].material.uniforms.col.value = this.originalColor;
	this.children[ 0 ].material.uniforms.seed.value = new THREE.Vector2( this.noiseSeed.x + this.time, this.noiseSeed.y + n );	
}

module.exports = Static;