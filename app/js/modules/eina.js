var Eina = function( parent, element ){
	this.parent = parent;
	this.element = element;

	this.frame = element.firstChild;

	this.totalFrames = 28;
	this.currentImage = 0;
	this.firstImageLoaded = false;

	for( var i = 0 ; i < this.totalFrames ; i++ ){
		var newImg = new Image;
		newImg.addEventListener('load', this.imageLoaded.bind(this) );
		newImg.src = 'img/eina/' + i + '.png';
	}
}

Eina.prototype.mouseMove = function( position ){
	var imgNum = Math.round( position.x * ( this.totalFrames - 1 ) );
	if( imgNum !== this.currentImage ) this.imageUpdate( imgNum );  
}

Eina.prototype.imageUpdate = function( imgNum ){
	if( this.frame.children.length !== this.totalFrames ) return;
	this.frame.children[ this.currentImage ].classList.remove( 'active' );
	this.currentImage = imgNum;
	this.frame.children[ this.currentImage ].classList.add( 'active' );
}
Eina.prototype.imageLoaded = function( e ){
	this.frame.appendChild( e.currentTarget );
	if( !this.firstImageLoaded ) e.currentTarget.classList.add( 'active' );
	this.firstImageLoaded = true;
}
module.exports = Eina;