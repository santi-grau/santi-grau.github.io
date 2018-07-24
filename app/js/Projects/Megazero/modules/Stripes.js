var Stripes = function( geo, id, props ){
	THREE.Object3D.apply(this, arguments);

	this.geo = geo;
	this.name = id;
	
	this.time = 0;
	this.timeInc = 0.1;

	geo.computeBoundingBox();
	
	var varw = 10;

	this.max = geo.boundingBox.max;
	this.min = geo.boundingBox.min;
	new THREE.Vector2(this.max.x - this.min.x, this.max.y - this.min.y);
	
	this.range = new THREE.Vector2(this.max.x - this.min.x, this.max.y - this.min.y);

	var barNum = Math.round( this.range.x / varw );
	this.barWidth = this.range.x / barNum;

	for( var i = 0 ; i < barNum + 1; i++ ){
		var geometry = new THREE.BoxBufferGeometry( this.barWidth, this.range.y, 330 );
		var c =  new THREE.Vector3( 1, 1, 1 );
		if( i % 2 == 0 ) c = new THREE.Vector3( 0, 0, 0 );

		var material = new THREE.ShaderMaterial({
			uniforms : {
				col : { value : c },
				seed : { value : Math.random() }
			},
			vertexShader: require('./../shaders/static.vs'), 
			fragmentShader: require('./../shaders/static.fs')
		});
		var mesh = new THREE.Mesh( geometry, material );
		this.add( mesh );
	}
	this.resetPosition( 1000 + Math.random() * 3000 );	
}

Stripes.prototype = Object.create(THREE.Object3D.prototype);
Stripes.prototype.constructor = Stripes;

Stripes.prototype.resetPosition = function( delay ){
	this.children.forEach( function( mesh, i ) {
		mesh.position.set( this.min.x + this.barWidth * i - this.barWidth * 0.5, this.min.y + this.range.y - this.range.y * 0.5 , 0 );
		mesh.material.uniforms.col.value = new THREE.Vector3( 1 - mesh.material.uniforms.col.value.x, 1 - mesh.material.uniforms.col.value.y, 1 - mesh.material.uniforms.col.value.z );
	}.bind( this ));

	this.children[ this.children.length - 1 ].visible = true;
	this.children[ 0 ].position.x = this.min.x;
	this.children[ 0 ].scale.x = 0.001;
	this.children[ this.children.length - 1 ].scale.x = 1;
	this.children[ this.children.length - 1 ].scale.z = 1;
	setTimeout( this.resetMove.bind( this ), delay || 0 );
}

Stripes.prototype.resetMove = function(){
	var tTime = 1.3;
	var stagger = 0.05;

	var ease = Elastic.easeOut.config(1, 0.75);

	for( var i = 1 ; i < this.children.length - 1 ; i++ ) TweenLite.to( this.children[i].position, tTime / 2, { x : '+=' + this.barWidth, ease : ease, delay : stagger * ( ( this.children.length - 1 ) - ( i -  1) ) } );
	
	// move last bar and scale
	TweenLite.to( this.children[ this.children.length - 1 ].position, tTime * 0.4, { x : '+=' + this.barWidth * 2, ease : Power4.easeOut, delay : stagger } );
	TweenLite.to( this.children[ this.children.length - 1 ].scale, tTime * 0.2, { x : 0.001, ease : Power4.easeOut, delay : stagger * ( this.children.length - 4 ) } );
	TweenLite.to( this.children[ this.children.length - 1 ].scale, tTime * 0.2, { z : 0.001, ease : Power4.easeOut, delay : stagger * ( this.children.length - 2 ), onComplete : function(){ this.children[ this.children.length - 1 ].visible = false; }.bind( this ) } );

	// move first bar and scale
	TweenLite.to( this.children[ 0 ].scale, tTime, { x : 1, ease : ease, delay : stagger * ( this.children.length - 1 ) } );
	TweenLite.to( this.children[ 0 ].position, tTime, { x : '+=' + this.barWidth /2, ease : ease, delay : stagger * ( this.children.length - 1 ), onComplete : this.resetPosition.bind( this ) } );
}

Stripes.prototype.step = function( time ){
	this.time += this.timeInc;
	// this.children[0].material.uniforms.time.value = this.time;
}

module.exports = Stripes;