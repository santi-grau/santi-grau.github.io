var Data = require('./data.json');

var Bulli = function(){
	this.group = new THREE.Object3D();
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.rotation = 0;
	this.rotationEased = 0;
	this.displacement = 0.5;
	this.displacementEased = 0.5;

	var select = Math.round( Math.random() * ( Data.length - 1 ) );
	this.data = Data;
	var coords = this.data[select].coords;
	var data = []
	for( var i = 0 ; i < coords.length ; i++ ){
		this.data[select].drawing[ i ] = true;
		var line = coords[i];
		var vals = line.match(/.{1,4}/g);
		var cs = [];
		for( var j = 0 ; j < vals.length ; j+= 2 ){
			var x = parseInt( vals[ j ] ) / 10, y = parseInt( vals[ j + 1 ] ) / 10;
			cs.push( [ x, y ] );
		}
		data.push( cs );
	}
	this.addGroup( data, this.data[ select ].dims );
	this.scene.add( this.group );
}

Bulli.prototype.addGroup = function( data, dims ){
	var group = new THREE.Object3D();
	var material = new THREE.LineBasicMaterial( { color: 0x000000 } );

	for( var i = 0 ; i < data.length ; i++ ){
		var MAX_POINTS = data[i].length;

		var geometry = new THREE.BufferGeometry();
		var positions = new Float32Array( MAX_POINTS * 3 );
		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

		var x = y = z = index = 0;
		for ( var j = 0; j < MAX_POINTS; j ++ ) {
			geometry.attributes.position.array[ index ++ ] = data[i][j][0] - dims.minx - ( dims.maxx - dims.minx ) / 2;
			geometry.attributes.position.array[ index ++ ] = -data[i][j][1] + dims.miny + ( dims.maxy - dims.miny ) / 2;
			geometry.attributes.position.array[ index ++ ] = -50 + Math.random() * 100;
		}

		geometry.setDrawRange( 0, Math.floor( Math.random() * MAX_POINTS ) );
		var line = new THREE.Line( geometry,  material );
		group.add(line);
	}
	this.group.add( group );
}

Bulli.prototype.setActive = function( x, y ){
	this.setMouse( x, y );
	this.rotation = Math.PI / 8 * ( y - 0.5 );
}

Bulli.prototype.setMouse = function( x, y ){
	this.rotation = Math.PI / 8 * ( y - 0.5 );
	this.displacement = x;
}

Bulli.prototype.resize = function( dims ){
	this.group.position.set( dims.x, dims.y, 0 ); 
	for( var i = 0 ; i < this.group.children.length ; i++ ){
		var modelDims = this.data[i].dims;
		var modelAR = modelDims.height / modelDims.width;
		var stageAR = dims.height / dims.width;
		var s;
		if( modelAR > stageAR ) s = dims.height / modelDims.height;
		else s = dims.width / modelDims.width;
		s *= 0.65;
		this.group.children[ i ].scale.set( s, s, 1 );
	}
	// console.log(dims)
	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Bulli.prototype.step = function( time ){

	this.rotationEased += ( this.rotation - this.rotationEased ) * 0.1;
	this.displacementEased += ( this.displacement - this.displacementEased ) * 0.1;

	this.group.rotation.x = this.rotationEased;
	for( var i = 0 ; i < this.group.children.length ; i++ ){
		var group = this.group.children[i];
		for( var j = 0 ; j < group.children.length ; j++ ){
			var geo = group.children[j].geometry;
			geo.setDrawRange( 0, Math.round( this.displacementEased * geo.getAttribute('position').count ) );
		}
	}
}

module.exports = Bulli;