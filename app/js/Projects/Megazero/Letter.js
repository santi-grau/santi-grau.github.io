var blocks = {
	bar : require('./modules/Bar'),
	static : require('./modules/Static'),
	black : require('./modules/Black'),
	pattern : require('./modules/Pattern'),
	stripes : require('./modules/Stripes'),
	checker : require('./modules/Checker'),
	vdist : require('./modules/Vdist')
}

var Letter = function( letter, id ){
	THREE.Object3D.apply(this, arguments);
	this.name = id;
	this.time = 0;
	this.timeInc = 0.1;

	this.visible = false;

	var loader = new THREE.JSONLoader();

	for (var block in letter ) {
		var matId = letter[ block ].props.matId;
		var geo = loader.parse( letter[ block ].geo ).geometry;
		if( blocks[ matId ] ){
			var b = new blocks[ matId ]( geo, block, letter[ block ].props );
			b.position.set( Math.random(), Math.random(), Math.random() );
			this.add( b );
		}
	}
	new THREE.Box3().setFromObject( this ).getCenter( this.position ).multiplyScalar( - 1 );
}

Letter.prototype = Object.create(THREE.Object3D.prototype);
Letter.prototype.constructor = Letter;

Letter.prototype.barsColorSwap = function(){
	var blocks = this.children;
	var colors = [];
	var bars = [];
	this.children.forEach( function( mesh ) {
		if( mesh.name.split('_')[ 0 ].replace(/[0-9]/g, '') == 'bar' ) {
			colors[ mesh.name.split('_')[ 0 ].replace(/bar/g, '') - 1 ] = mesh.children[0].material.uniforms.col.value;
			bars[ mesh.name.split('_')[ 0 ].replace(/bar/g, '') - 1 ] = mesh.children[0]; 
		}
	}.bind( this ));

	if( this.oldBarCount !== this.barCount ){
		colors.push( colors.shift() );
		bars.forEach( function( bar, i ){ bar.material.uniforms.col.value = colors[ i ] } );
	}
	this.oldBarCount = this.barCount;
}

Letter.prototype.barColorize = function(){
	var barCount = 0;
	this.children.forEach( function( mesh ) { if( mesh.name.split('_')[ 0 ].replace(/[0-9]/g, '') == 'bar' ) barCount++; });
	var cicles = Math.ceil( Math.random( ) * 5 );
	
	this.barCount = 0;
	this.oldBarCount = 0;
	TweenLite.to( this, cicles / 4, { barCount : cicles * barCount, roundProps : 'barCount', onUpdate : this.barsColorSwap.bind( this ), ease : Power0.easeNone } );
}

Letter.prototype.step = function( time ){
	this.time += this.timeInc;
	this.children.forEach( function( mesh ) {
		if( mesh.step && this.visible ) mesh.step( time );
	}.bind( this ));
}

module.exports = Letter;