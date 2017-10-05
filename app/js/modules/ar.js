var Ar = function( parent, element ){
	this.parent = parent;
	this.element = element;

	this.video = document.getElementsByTagName('video')[0];

	this.setVideoSize();
	this.video.classList.add('active');

	// this.video.addEventListener('canplaythrough', function() {
	// 	console.log('ok')
 //  });
}

Ar.prototype.setVideoSize = function( ) {
	var videoAR = 1080/1920;
	var frameAR = this.element.offsetHeight / this.element.offsetWidth;
	if( videoAR < frameAR ){
		this.video.setAttribute( 'height' , this.element.offsetHeight );
		this.video.setAttribute( 'width' , this.element.offsetHeight / videoAR );
		this.video.style.transform = 'translate3d(' + -( this.element.offsetHeight / videoAR - this.element.offsetWidth ) / 2 + 'px,0,0)';
	} else {
		this.video.setAttribute( 'width' , this.element.offsetWidth );
		this.video.setAttribute( 'height' , this.element.offsetWidth * videoAR );
		this.video.style.transform = 'translate3d(0,' + -( this.element.offsetWidth * videoAR - this.element.offsetHeight ) / 2 + 'px,0)';
	}
};

Ar.prototype.mouseMove = function( position ){
	this.video.currentTime = ( this.video.duration * position.x ).toFixed(1);
}

Ar.prototype.step = function( time ){
	// this.video.currentTime = ( Math.sin( time/1000 ) * 3 + 6 ).toFixed(1);
	// console.log(this.video.currentTime)
}


module.exports = Ar;