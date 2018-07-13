var ParticleGeometry = function( parent ){
	this.parent = parent;

	var tSize = this.parent.letterRes;
	this.letterParticles = tSize * tSize;
	var geometry = new THREE.BufferGeometry(), position = [], lookup = [], transform = [], seeds = [];
	
	for( var i = 0 ; i < this.letterParticles ; i++ ){
		position.push( 0, 0, 0 );
		lookup.push( 0, 0, 0, 0 );
		transform.push( 0, 0, Math.random(), Math.random() );
		seeds.push( Math.random(), Math.random(), Math.random(), Math.random() );
	}
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( position ), 3 ) );
	geometry.addAttribute( 'lookup', new THREE.BufferAttribute( new Float32Array( lookup ), 4 ) );
	geometry.addAttribute( 'transform', new THREE.BufferAttribute( new Float32Array( transform ), 4 ) );
	geometry.addAttribute( 'seeds', new THREE.BufferAttribute( new Float32Array( seeds ), 4 ) );

	this.geometry = geometry;
}

ParticleGeometry.prototype.addLetter = function( char ) {
	var charData = this.parent.data.chars[ char ];
	// console.log(charData)

	var particles = this.parent.letterRes * this.parent.letterRes;

	for( var i = 0 ; i < particles ; i++ ){
		this.geometry.attributes.lookup.setXYZW( i, charData.x, charData.y, charData.width, charData.height );
		this.geometry.attributes.transform.setXY( i, -charData.width / 2, parseInt( charData.yoffset ) + this.parent.data.info.size / ( 2 * this.parent.scale.x ) );
	}
	this.geometry.attributes.lookup.needsUpdate = true;
	this.geometry.attributes.transform.needsUpdate = true;
	
	var totalParts = Math.round( particles * charData.areaRelative );
	var partsPlaced = 0;
	var safeCount = 0;
	while(partsPlaced < totalParts ){
		var px = Math.random();
		var py = Math.random();
		var val = charData.imgData.data[ ( ( Math.floor( py * charData.height ) * ( charData.imgData.width * 4 ) ) + ( Math.floor( px * charData.width ) * 4 ) ) + 3 ];
		if( val > 0 ) this.geometry.attributes.position.setXY( (partsPlaced++), px, py );
		else safeCount++;
		if( safeCount > 100000 ) this.geometry.attributes.position.setXY( (partsPlaced++), px, py );
	}
	for( var i = partsPlaced ; i < this.parent.letterRes * this.parent.letterRes ; i++ ) this.geometry.attributes.position.setXY( i, 0, 0 );

	this.geometry.attributes.position.needsUpdate = true;
};

module.exports = ParticleGeometry;