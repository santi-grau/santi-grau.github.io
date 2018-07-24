var Black = function( geo, id, props ){
	THREE.Object3D.apply(this, arguments);

	this.time = Math.random() * 100;
	this.timeInc = 0.02;

	geo.computeBoundingBox();
	var max = geo.boundingBox.max, min = geo.boundingBox.min;
	var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

	var material = new THREE.MeshBasicMaterial( { wireframe : true, color : 0xffffff } );

	var material = new THREE.ShaderMaterial({
		uniforms : {
			time : { value : this.time },
			resolution : { value : range }
		},
		vertexShader: require('./../shaders/black.vs'), 
		fragmentShader: require('./../shaders/black.fs')
	});

	var mesh = new THREE.Mesh( geo, material );
	mesh.scale.z = 300;
	mesh.position.z = -mesh.scale.z / 2;
	this.name = id;
	this.add( mesh );
}

Black.prototype = Object.create(THREE.Object3D.prototype);
Black.prototype.constructor = Black;

Black.prototype.step = function( time ){
	this.time += this.timeInc;
	this.children[0].material.uniforms.time.value = this.time;
}

module.exports = Black;