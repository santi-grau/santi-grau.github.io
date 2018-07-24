var Checker = function( geo, id, props ){
	THREE.Object3D.apply(this, arguments);

	this.time = 0;
	this.timeInc = 0.1;

	geo.computeBoundingBox();
	var material = new THREE.MeshBasicMaterial( { wireframe : true, color : 0xffffff } );
	var max = geo.boundingBox.max, min = geo.boundingBox.min;
	var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

	var fit = new THREE.Vector2( range.x / 40, range.y / 40 );
	var g = new THREE.BoxBufferGeometry( 40, 40, 2 );
	var gvs = Array.prototype.slice.call( g.attributes.position.array );
	var nrm = Array.prototype.slice.call( g.attributes.normal.array );
	var gid = Array.prototype.slice.call( g.index.array );
	var nvs = [], nnrm = [], nid = [], bid = [], cid = [];

	var alt = false;
	var odd = false;
	var inc = 0;
	for( var h = 0 ; h < fit.y ; h++ ){
		for( var i = 0 ; i < fit.x ; i++ ){
			for( var j = 0 ; j < gvs.length ; j+=3 ) {
				if( alt ) {
					if( odd ) cid.push( 0 );
					else cid.push( 1 );
				} else {
					if( odd ) cid.push( 0 );
					else cid.push( 1 );
				}
				bid.push( i, h );
				nvs.push( gvs[ j ] + ( 40 * i + 40 * 0.5 ), gvs[ j + 1 ] + ( 40 * h + 40 * 0.5 ), gvs[ j + 2 ] );

			}
			for( var j = 0 ; j < nrm.length ; j++ ) nnrm.push( nrm[ j ] );
			for( var j = 0 ; j < gid.length ; j++ ) nid.push( gid[ j ] + inc * gvs.length / 3 );
			odd = !odd;
			inc++;
		}
		alt = !alt;
	}

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'col', new THREE.BufferAttribute( new Float32Array( cid ), 1 ) );
	geometry.addAttribute( 'blockId', new THREE.BufferAttribute( new Float32Array( bid ), 2 ) );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( nvs ), 3 ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( nnrm ), 3 ) );
	geometry.setIndex( nid );


	var material = new THREE.ShaderMaterial({
		uniforms : {
			time : { value : this.time },
			resolution : { value : range }
		},
		vertexShader: require('./../shaders/checker.vs'), 
		fragmentShader: require('./../shaders/checker.fs')
	});

	var mesh = new THREE.Mesh( geometry, material );

	mesh.position.set( min.x, min.y, 0 );
	this.name = id;
	this.add( mesh );

}

Checker.prototype = Object.create(THREE.Object3D.prototype);
Checker.prototype.constructor = Checker;

Checker.prototype.step = function( time ){
	this.time += this.timeInc;
	this.children[0].material.uniforms.time.value = this.time;
}

module.exports = Checker;