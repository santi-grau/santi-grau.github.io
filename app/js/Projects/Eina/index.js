var blocks = require('./block.json')
var Eina = function( dims ){
	this.dims = dims;
	
	this.group = new THREE.Object3D();

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.scene.add( this.group );
	this.blocks = blocks;
	this.maxHeight = 24;
	this.maxWidth = 20;
	
	var geometry = new THREE.PlaneBufferGeometry( 1, 1 );

	for( var i = 0 ; i < 100 ; i++ ){
		var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		var plane = new THREE.Mesh( geometry, material );
		plane.visible = false;
		this.group.add( plane );
	}
	for( var i = 0 ; i < 100 ; i++ ){
		var material = new THREE.MeshBasicMaterial( { color: 0x222222 } );
		var plane = new THREE.Mesh( geometry, material );
		plane.visible = false;
		this.group.add( plane );
	}
	this.activeBlock = 0;
	this.makeBlock( );
}

Eina.prototype.makeBlock = function( ){
	for( var i = 0 ; i < this.group.children.length ; i++ ) this.group.children[i].visible = false;
	for( var i = 0 ; i < this.blocks[ this.activeBlock ].ls.length ; i++ ) this.group.children[i].visible = true;
	for( var i = 100 ; i < 100 + this.blocks[ this.activeBlock ].ls.length ; i++ ) this.group.children[i].visible = true;
	this.resize( this.dims );
}

Eina.prototype.setBlockSize = function(){
	var id = this.activeBlock;
	var vb = this.blocks[ id ].vb;
	var screenAR = this.dims.height / this.dims.width;
	var logoAR = this.maxHeight / this.maxWidth;
	var modSize = this.dims.height * 0.8 / this.maxHeight;
	if( logoAR < screenAR ) modSize = this.dims.width * 0.8 / this.maxWidth;
	var data = this.blocks[ this.activeBlock ];
	for( var i = 0 ; i < data.ls.length ; i++ ){
		var block = this.group.children[ i ];
		var blockData = data.ls[ i ];
		var s = new THREE.Vector3( modSize * blockData[ 2 ], modSize * blockData[ 3 ], 1 )
		block.position.set( modSize * ( blockData[ 2 ] / 2 + ( blockData[ 0 ] ) ) - modSize * vb[ 0 ] /2,  -modSize * ( blockData[ 3 ] / 2 + ( blockData[ 1 ] - 1 ) ) + modSize * vb[ 1 ] /2,  0  );
		block.scale.set( modSize * blockData[ 2 ] + modSize / 16, modSize * blockData[ 3 ] + modSize / 16, 1 );
	}

	for( var i = 100 ; i < 100 + data.ls.length ; i++ ){
		var block = this.group.children[ i ];
		var blockData = data.ls[ i - 100 ];
		var s = new THREE.Vector3( modSize * blockData[ 2 ], modSize * blockData[ 3 ], 1 )
		block.position.set( modSize * ( blockData[ 2 ] / 2 + ( blockData[ 0 ]) ) - modSize * vb[ 0 ] /2,  -modSize * ( blockData[ 3 ] / 2 + ( blockData[ 1 ] - 1 ) ) + modSize * vb[ 1 ] /2,  1  );
		block.scale.set( modSize * blockData[ 2 ] - modSize / 8, modSize * blockData[ 3 ]  - modSize / 8, 1 );
	}
}

Eina.prototype.setActive = function( xmouse, ymouse, dims ){
	
}

Eina.prototype.setMouse = function( x, y ){
	if( this.activeBlock < this.blocks.length - 1 ) this.activeBlock++;
	else this.activeBlock = 0;
	
	this.makeBlock();
}

Eina.prototype.resize = function( dims ){
	this.dims = dims;
	this.setBlockSize();

	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Eina.prototype.step = function( time ){
	
}

module.exports = Eina;