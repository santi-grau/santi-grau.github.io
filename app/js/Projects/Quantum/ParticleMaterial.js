var vs = require('./pointsVs.glsl');
var fs = require('./pointsFs.glsl');

var ParticleMaterial = function( parent ){
	this.parent = parent;

	var fontTexture = new THREE.Texture( this.parent.dataTexture )
	fontTexture.needsUpdate = true;

	var pointTexture = new THREE.TextureLoader().load(window._PATH_ + 'quantum/points.png');
	pointTexture.magFilter = THREE.NearestFilter;
	pointTexture.minFilter = THREE.NearestFilter;

	var material = new THREE.ShaderMaterial( {
		uniforms : {
			fontTexture : { value : fontTexture },
			pointTexture : { value : pointTexture },
			fontTexRes : { value : new THREE.Vector2( this.parent.dataTexture.width, this.parent.dataTexture.height ) },
			dimensions : { value : new THREE.Vector3( this.parent.data.asset.base, this.parent.data.info.padding.split(',')[0], this.parent.data.info.padding.split(',')[1] ) },
			oscillation : { value : this.parent.oscillation },
			pointSize : { value : this.parent.pointSize },
			dispersion : { value : this.parent.dispersion },
			color : { value : this.parent.color },
			settings : { value : new THREE.Vector4( this.parent.time, this.parent.scale.x, this.parent.weight.x, 0 ) }
		},
		transparent : true,
		vertexShader: vs,
		fragmentShader: fs,
		depthTest : false,
		depthWrite : false
	} );

	this.material = material;
}

module.exports = ParticleMaterial;