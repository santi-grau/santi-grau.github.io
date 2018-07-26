var SimplexNoise = require('simplex-noise');
var lineVs = require('./lineVs.glsl');
var lineFs = require('./lineFs.glsl');

var Remolacha = function( ){
	this.group = new THREE.Object3D();

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	this.bigRadius = 200;
	this.ringRadius = this.bigRadius / 3.2;
	this.rings = 256;
	this.segments = 64;
	this.pos0 = [];
	this.pos1 = [];
	this.pos2 = [];
	this.temperature = 1;
	this.soil = Math.random();
	this.soilEased = this.soil;
	this.air = Math.random();
	this.airEased = this.air;
	this.airInc = Math.random();
	this.speed = 0.01;
	this.timeStep = 0;
	this.waterPhase = 0;
	this.waterPhaseEased = 0;
	this.waterIntensity = 0;
	this.waterIntensityEased = 0;
	this.generators = [];
	for( var i = 0 ; i < 3 ; i++ ) this.generators.push( new SimplexNoise( Math.random ) );

	var position = [], ids = [], iids = [];
	for( var i = 0 ; i < this.rings - 1 ; i++ ){
		for( var j = 0 ; j < this.segments + 3 ; j++ ){
			position.push( 0, 0, 0 );
			ids.push( i );
			iids.push( j );
		}
	}

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( position ), 3 ) );
	geometry.addAttribute( 'ids', new THREE.BufferAttribute( new Float32Array( ids ), 1 ) );
	geometry.addAttribute( 'iids', new THREE.BufferAttribute( new Float32Array( iids ), 1 ) );

	var material = new THREE.ShaderMaterial( {
		uniforms: {
			bigRadius : { value : this.bigRadius },
			pos0 : { value : [0,0,0] },
			pos1 : { value : [0,0,0] },
			pos2 : { value : [0,0,0] },
			params : { value : new THREE.Vector3( this.soil, this.air, this.rings ) },
			water : { value : new THREE.Vector2( this.waterPhase, this.waterIntensity ) },
		},
		vertexShader: lineVs,
		fragmentShader: lineFs,
		transparent: true
	} );

	this.mesh = new THREE.Line( geometry, material );
	this.group.add( this.mesh );

	this.scene.add( this.group );
}

Remolacha.prototype.setActive = function( x, y ){
	this.setMouse( x, y );
	this.waterPhaseEased = 800 - Math.abs( (  x * this.dims.width - this.dims.width / 2 ) / ( this.dims.width / 2 ) ) * 500;
	this.waterIntensityEased = 1 + Math.abs( (  y * this.dims.height - this.dims.height / 2 ) / ( this.dims.height / 2 ) ) * 2;
}

Remolacha.prototype.setMouse = function( x, y ){

	var v = new THREE.Vector2( Math.abs( (  x * this.dims.width - this.dims.width / 2 ) / ( this.dims.width / 2 ) ), Math.abs( (  y * this.dims.height - this.dims.height / 2 ) / ( this.dims.height / 2 ) ) );
	this.waterPhase = 800 - v.x * 500;
	this.waterIntensity = 1 + v.y * 2;
	this.soil = x;
	this.air = 0.1 + y;

	this.speed = 0.01 + v.length() / 100;
}

Remolacha.prototype.resize = function( dims ){
	this.dims = dims;
	this.group.position.set( dims.x, dims.y, 0 );
	this.bigRadius = Math.min( dims.width, dims.height ) / 4;
	this.ringRadius = this.bigRadius / 3.2;

	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Remolacha.prototype.step = function( time ){
	this.timeStep += this.speed;
	this.air += 0.0005 + 0.003 * this.airInc;

	this.soilEased += ( this.soil - this.soilEased ) * 0.1;
	this.airEased += ( this.air - this.airEased ) * 0.1;
	this.waterPhaseEased += ( this.waterPhase - this.waterPhaseEased ) * 0.1;
	this.waterIntensityEased += ( this.waterIntensity - this.waterIntensityEased ) * 0.1;

	for( var j = 0 ; j < 3 ; j++ ){
		var pos = [], zeropos = [];
		for( var i = 0 ; i < this.segments ; i++ ){
			var p = [ Math.cos( Math.PI * 2 * i / ( this.segments ) ), Math.sin( Math.PI * 2 * i / ( this.segments ) ) ];
			if( i == 0 ){
				var n = this.generators[j].noise2D( p[0] + this.timeStep, p[1] ) * this.temperature * this.ringRadius / 5;
				pos.push( p[0] * ( this.ringRadius + n ), p[1] * ( this.ringRadius + n ), 0 );
			}
			var n = this.generators[j].noise2D( p[0] + this.timeStep, p[1] ) * this.temperature * this.ringRadius / 5;
			pos.push( p[0] * ( this.ringRadius + n ), p[1] * ( this.ringRadius + n ), 0 );
			if( i == this.segments - 1 ) pos.push( zeropos[0], zeropos[1], 0, zeropos[0], zeropos[1], 0 );	
			if( i == 0 ){
				var n = this.generators[j].noise2D( p[0] + this.timeStep, p[1] ) * this.temperature * this.ringRadius / 5;
				zeropos = [ p[0] * ( this.ringRadius + n ), p[1] * ( this.ringRadius + n ), 0 ];
			}
		}
		this[ 'pos' + j ] = pos;
	}

	this.mesh.material.uniforms.pos0.value = this.pos0;
	this.mesh.material.uniforms.pos1.value = this.pos1;
	this.mesh.material.uniforms.pos2.value = this.pos2;
	this.mesh.material.uniforms.bigRadius.value = this.bigRadius;
	this.mesh.material.uniforms.params.value = new THREE.Vector3( this.soilEased, this.airEased, this.rings );
	this.mesh.material.uniforms.water.value = new THREE.Vector2( this.waterPhaseEased, this.waterIntensityEased );
}

module.exports = Remolacha;