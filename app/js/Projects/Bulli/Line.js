var Data = require('./data.json');

var Bulli = function( node, params ){
	this.node = node;
	this.canvas = document.createElement('canvas');

	this.node.style.background = '#ffffff'
	this.ctx = this.canvas.getContext('2d');
	this.node.appendChild( this.canvas );

	var select = params.select;
	this.data = Object.assign({}, Data[select]);
	this.data.cs = [];
	var coords = this.data.coords;
	var data = []
	this.coordCount = [];
	for( var i = 0 ; i < this.data.coords.length ; i++ ){
		this.coordCount[i] = 0;
		this.data.drawing[ i ] = true;
		var line = this.data.coords[i];
		var vals = line.match(/.{1,4}/g);
		var cs = [];
		for( var j = 0 ; j < vals.length ; j+= 2 ) cs.push( [ parseInt( vals[ j ] ) / 10 * 2, parseInt( vals[ j + 1 ] ) / 10 * 2 ] );
		data.push( cs );
		this.data.cs[i] = cs;
	}

	this.ctx.scale(2,2);
	this.ctx.lineWidth = 0.5;

	var modelDims = this.data.dims;
	var modelAR = modelDims.height / modelDims.width;
	var stageAR = this.node.offsetHeight / this.node.offsetWidth;
	if( modelAR > stageAR ) this.s = this.node.offsetHeight / modelDims.height;
	else this.s = this.node.offsetWidth / modelDims.width;
	this.s *= 0.9;
	this.ready = true;
}

Bulli.prototype.addLines = function( ){
	var add = 5;
	
	var finished = true;
	for( var i = 0 ; i < this.data.cs.length ; i++ ){
		this.ctx.beginPath();
		var MAX_POINTS = this.data.cs[i].length;
		var count;
		if( this.coordCount[i] + add <  MAX_POINTS ) count = this.coordCount[i] + add;
		else count = MAX_POINTS;
		
		if( this.coordCount[i] < MAX_POINTS ) finished = false;

		for ( var j = this.coordCount[i]; j < count ; j ++ ) {
			var x = ( this.data.cs[i][j][0] -this.data.dims.minx ) * this.s;
			var y = ( this.data.cs[i][j][1] -this.data.dims.miny ) * this.s;
			x += ( this.node.offsetWidth - this.data.dims.width * this.s ) / 2;
			y += ( this.node.offsetHeight - this.data.dims.height * this.s ) / 2;
    		this.ctx.lineTo( x, y );
		}
		this.coordCount[i] += add - 1;
		this.ctx.stroke();
	}

	if( finished ) {
		for( var i = 0 ; i < this.data.cs.length ; i++ ) this.coordCount[i] = 0;
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
	}
}

Bulli.prototype.makeImage = function(){
	
}

Bulli.prototype.resize = function( ){
	var width = this.node.offsetWidth, height = this.node.offsetHeight;

	this.canvas.width = width * 2;
	this.canvas.height = height * 2;
	this.canvas.style.width = width + 'px';
	this.canvas.style.height = height + 'px';
}

Bulli.prototype.step = function( time ){
	this.addLines();
}

module.exports = Bulli;