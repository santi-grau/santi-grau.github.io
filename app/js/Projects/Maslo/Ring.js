var Ring = function( id, noise ){
	this.noise = noise;
	
	this.radius 	= 1;
	this.res 	= r	= 256;
	this.osc 		= 0.05;
	this.intensity 	= 1;
	this.gaussIt 	= 0;
	this.weightIn 	= 0;
	this.radiusInc 	= 0;
	var geometry = new THREE.BufferGeometry(), positions = [], indices = [], colors = [], points = Math.round( r * 0.3 ), minDiv = 0.01;

	for( var i = 0 ; i < r * 3 + 1 ; i++ ) positions.push( 0, 0, id );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );

	for( var i = 0 ; i < r ; i++ ) indices.push( 0, i, i+1 );
	for( var i = 0 ; i < r - 1; i++ ) indices.push( r + 1 + i, r * 2 + 1 + i, r + 2 + i, r + 2 + i, r * 2 + 1 + i, r * 2 + 2 + i );
	indices.push( 0, r, 1, r * 2, r * 3, r + 1, r  + 1, r * 3, r * 2+ 1 );
	geometry.setIndex( indices );

	for( var i = 0 ; i < r * 3 + 1 ; i++ ) colors.push( 0, 0, 0, 1 );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 4 ) );
	
	this.gauss = [];
	for( var i = 0 ; i <= points ; i++ ) this.gauss[i] = ( Math.sin( 2 * Math.PI * ( ( i / points ) - 0.25 ) ) + 1 ) / 2 + minDiv;
	for( var i = 0 ; i < Math.round( r - points ) / 2 ; i++ ) this.gauss.unshift( minDiv );
	for( var i = this.gauss.length ; i < r ; i++ ) 	this.gauss.push( minDiv );

	var material = new THREE.ShaderMaterial( {
		vertexShader: 'attribute vec4 color; varying vec4 vColor; void main() { vColor = color; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
		fragmentShader: 'varying vec4 vColor; void main() { vec4 color = vColor; gl_FragColor = color; }'
	} );

	this.mesh = new THREE.Mesh( geometry, material );
	this.mesh.rotation.z = Math.PI * 2 / 90 * id;
}

Ring.prototype.setColor = function( c0, c1 ){
	for( var i = 0 ; i < r + 1 ; i++ ) this.mesh.geometry.attributes.color.setXYZ( ( i ), c0[0], c0[1], c0[2] );
	for( var i = r + 1 ; i < r * 3 + 1 ; i++ ) this.mesh.geometry.attributes.color.setXYZ( i, c1[0], c1[1], c1[2] );
	this.mesh.geometry.attributes.color.needsUpdate = true;
}

Ring.prototype.setRadius = function( width, height ){
	this.radius = Math.min( width, height ) * 0.8 * 0.5;
}

Ring.prototype.step = function( time, id, oldPoints ){	
	this.ps = [];

	for( var i = 0 ; i < this.res ; i++ ){
		var vector = new THREE.Vector2( Math.cos( Math.PI * 2 * i / this.res ), Math.sin( Math.PI * 2 * i / this.res ) );

		var dim1 = ( vector.x + id / 10 ) / ( 1 / this.intensity );
		var dim2 = ( vector.y + time ) / ( 1 / 0.2 );
		var n = ( this.noise.noise2D( dim1, dim2 ) + 1 ) / 2 * this.osc;
		n *= 1 - ( (1-this.gauss[i]) * this.gaussIt );

		var pps = new THREE.Vector2( vector.x * ( 1 - n ), vector.y * ( 1 - n ) );

		if( !oldPoints ) this.ps.push(pps);
		else this.ps.push( oldPoints[i].sub( vector.clone().multiplyScalar(n) ) );
		this.ps[i] = pps.clone().add( this.ps[i].clone().sub( pps.clone() ).multiplyScalar( this.weightIn ) );

		this.mesh.geometry.attributes.position.setXY( ( i + 1 ), this.ps[i].x * ( this.radius + this.radiusInc ), this.ps[i].y * ( this.radius + this.radiusInc )	 );
		this.mesh.geometry.attributes.position.setXY( ( this.res + i + 1 ), this.ps[i].x * ( this.radius + this.radiusInc ), this.ps[i].y * ( this.radius + this.radiusInc ) );
		this.mesh.geometry.attributes.position.setXY( ( this.res * 2 + i + 1 ), this.ps[i].x * ( ( this.radius + this.radiusInc ) + 1 ), this.ps[i].y * ( ( this.radius + this.radiusInc ) + 1 ) );
	}
	
	this.mesh.geometry.attributes.position.needsUpdate = true;
}

module.exports = Ring;