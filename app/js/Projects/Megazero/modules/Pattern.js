var Pattern = function( geo, id, props ){
	THREE.Object3D.apply(this, arguments);

	this.name = id;
	this.time = 0;
	this.timeInc = 0.1;

	var barwidth = 5 + Math.random() * 10;

	geo.computeBoundingBox();
	var material = new THREE.MeshBasicMaterial( { wireframe : true, color : 0xffffff } );
	var max = geo.boundingBox.max, min = geo.boundingBox.min;
	var range = new THREE.Vector2( max.x - min.x, max.y - min.y );
	var density = Math.floor( range.x / barwidth )

	var g = new THREE.BoxBufferGeometry( range.x / density, range.y, 2 );
	var gvs = Array.prototype.slice.call( g.attributes.position.array );
	var nrm = Array.prototype.slice.call( g.attributes.normal.array );
	var gid = Array.prototype.slice.call( g.index.array );
	var nvs = [], nnrm = [], nid = [], bid = [];


	for( var i = 0 ; i < density ; i++ ){
		for( var j = 0 ; j < gvs.length ; j+=3 ) {
			bid.push( i );
			nvs.push( gvs[ j ] + ( range.x / density * i + range.x / density * 0.5 ), gvs[ j + 1 ] + range.y * 0.5, gvs[ j + 2 ] );
		}
		for( var j = 0 ; j < nrm.length ; j++ ) nnrm.push( nrm[ j ] );
		for( var j = 0 ; j < gid.length ; j++ ) nid.push( gid[ j ] + i * gvs.length / 3 );
	}
	
	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'blockId', new THREE.BufferAttribute( new Float32Array( bid ), 1 ) );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( nvs ), 3 ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( nnrm ), 3 ) );
	geometry.setIndex( nid );

	var material = new THREE.ShaderMaterial({
		uniforms : {
			time : { value : this.time },
			seed : { value : new THREE.Vector3( Math.random(), Math.random(), Math.random() ) }
		},
		// transparent : true,
		vertexShader: require('./../shaders/pattern.vs'), 
		fragmentShader: require('./../shaders/pattern.fs')
	});

	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( min.x, min.y, 0 );

	this.add( mesh );
}

Pattern.prototype = Object.create(THREE.Object3D.prototype);
Pattern.prototype.constructor = Pattern;

Pattern.prototype.step = function( time ){
	this.time += this.timeInc;
	this.children[0].material.uniforms.time.value = this.time;
}

module.exports = Pattern;