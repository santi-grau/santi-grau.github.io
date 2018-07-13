var Preloader = function(){
	this.node = document.getElementById( 'preloader' );
	this.inner = this.node.childNodes[0];

	this.percentLoaded = 0;
	this.percentLoadedSmoothed = 0;
	this.prevLoaded = 0;
	this.originalString = this.inner.innerHTML;
	this.strLength = this.inner.innerHTML.length;

	while( this.inner.offsetWidth < this.node.offsetWidth - 10) this.inner.innerHTML += '-';

	this.totalLength = this.inner.innerHTML.length - 1;
	this.loaderLength = this.inner.innerHTML.length - this.originalString.length - 2;

}

Preloader.prototype.update = function( v ){
	this.percentLoaded = v;
}

Preloader.prototype.progressBar = function( q ){
	this.inner.innerHTML = this.originalString;
	for( var i = 0 ; i < q ; i++ ) this.inner.innerHTML += '*';
	for( var i = q ; i < this.loaderLength ; i++ ) this.inner.innerHTML += '-';
	this.inner.innerHTML += ' ]';

	if( q == this.loaderLength ){
		setTimeout( function(){
			this.node.classList.add( 'loaded' );
			this.loaded = true;
			this.inner.innerHTML = ' [ SCROLL FOR MORE ]';
		}.bind( this ), 300 );
	}
}

Preloader.prototype.step = function( time ){
	if( this.loaded ) return;
	this.percentLoadedSmoothed += ( this.percentLoaded - this.percentLoadedSmoothed ) * 0.06;

	var loaded = Math.round( this.percentLoadedSmoothed * this.loaderLength );

	if( this.prevLoaded != loaded ) this.progressBar( loaded );
	this.prevLoaded = loaded;
}

module.exports = Preloader;