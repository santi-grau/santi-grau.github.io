document.body.classList.toggle( 'isMobile', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
const observer = new IntersectionObserver( n => { n.forEach( e => { ( e.isIntersecting ) ? e.target.onFocus() : e.target.onBlur() } ) }, { threshold: 1 } )

class AppSlide extends HTMLElement {
	connectedCallback() {
		this.currentAsset = 0
		this.addEventListener('click', _=> {
			clearInterval( this.slideInterval )
			if( this.autoPagerTimeout ) clearInterval( this.autoPagerTimeout )
			this.autoPagerTimeout = setTimeout( _=> {
				this.classList.remove( 'manual' )
				if( this.childNodes.length > 1 ) { this.slideInterval = setInterval( _=> this.nextFrame(), 3000 ) }
				this.nextFrame()
			}, 10000 )
			
			this.classList.add( 'manual' )
			this.nextFrame() 
		})
		this.preLoad( this.childNodes[ 0 ] )
		this.childNodes[ 0 ].classList.add( 'active' )
	}
	
	init( ){
		if( this.dataset.ready ) return this.attach()
		this.childNodes.forEach( n => this.preLoad( n ) )
		if( this.childNodes.length > 1 ) { this.slideInterval = setInterval( _=> this.nextFrame(), 3000 ) }
		this.dataset.ready = 1
	}

	nextFrame( ){
		this.childNodes[ this.currentAsset ].classList.remove( 'active' )
		if( this.childNodes[ this.currentAsset ].dataset.video ) this.childNodes[ this.currentAsset ].player.pause()
		this.currentAsset = ( parseInt( this.currentAsset ) < this.childNodes.length - 1 ) ? ( parseInt( this.currentAsset ) + 1 ) : 0;
		if( this.childNodes[ this.currentAsset ].dataset.video ) this.childNodes[ this.currentAsset ].player.play()
		this.childNodes[ this.currentAsset ].classList.add( 'active' )
	}

	loadVideo( n ){
		n.innerHTML = '<iframe src="' + n.dataset.video + '?autopause=0&amp;autoplay=1&loop=1&background=1' + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen ></iframe>'
		let iframe = n.childNodes[ 0 ]
		n.player = new Vimeo.Player( iframe )
		console.log( n.player )
		Promise.all( [ n.player.getVideoWidth(), n.player.getVideoHeight() ] ).then( dims => {
			let nodear = n.offsetHeight / n.offsetWidth, videoar = dims[ 1 ] / dims[ 0 ], 
			[ w, h ] = ( videoar > nodear ) ? [ n.offsetWidth, Math.floor( n.offsetWidth * videoar ) ] : [ Math.round( n.offsetHeight / videoar ), n.offsetHeight ];
			if( n.classList.contains( 'contain' ) ) [ w, h ] = ( videoar < nodear ) ? [ n.offsetWidth, Math.floor( n.offsetWidth * videoar ) ] : [ Math.round( n.offsetHeight / videoar ), n.offsetHeight ];
			iframe.setAttribute( 'height', h )
			iframe.setAttribute( 'width', w )
			n.player.pause()
		} )
	}

	preLoad( n ){
		if( n.dataset.style ) n.setAttribute( 'style', n.dataset.style )
		if( n.dataset.video ) this.loadVideo( n )
	}

	attach(){ 
		if( this.childNodes[ this.currentAsset ].dataset.video ) this.childNodes[ this.currentAsset ].player.play()
	}
	dettach(){
		Object.values( this.childNodes ).forEach( v => { if( v.player ) v.player.pause() } ) 
	}
}

class AppModule extends HTMLElement {
	connectedCallback() {
		observer.observe( this )
		Object.values( this.querySelectorAll('.info') ).forEach( b => b.innerHTML += '<br/><a class="infoToggle" href="javascript:void(0)">Less</a>' )
		Object.values( this.querySelectorAll('.infoToggle') ).forEach( b => b.addEventListener( 'click', _=> this.classList.toggle( 'info' ) ) )
	}
	onFocus(){
		this.classList.add( 'active' )
		Object.values( this.querySelectorAll('app-slide') ).forEach( n => n.init() )
	}
	onBlur(){
		this.classList.remove( 'active' )
		Object.values( this.querySelectorAll('app-slide') ).forEach( n => n.dettach() )
	}
}

class AppContainer extends HTMLElement {
    connectedCallback() {
        this.logo = this.querySelector( 'h1' )
		this.addEventListener('scroll', _=> this.flicker() )
		this.flicker()
		this.isSrolling = false
    }

	scrollEnd(){
		this.isSrolling = false
		this.classList.remove('scrolling')
	}

	flicker(){
		let c = Math.floor( Math.round( Math.random() ) * 255 )
        // this.logo.style.color = 'rgba( ' + c + ', ' + c + ', ' + c + ', 1 )'
		this.logo.style.color = 'rgba( ' + Math.floor( ( Math.random() ) * 255 ) + ', ' + Math.floor( ( Math.random() ) * 255 ) + ', ' + Math.floor( ( Math.random() ) * 255 ) + ', 1 )'
        this.logo.style.textDecoration = ( Math.random() > 0.5 ) ? 'none' : 'underline'
		if( this.scrollTimeout ) clearTimeout( this.scrollTimeout )
		this.scrollTimeout = setTimeout( _=> this.scrollEnd(), 100  )
		if( !this.isSrolling ) this.classList.add('scrolling')
		this.isSrolling = true
	}
}

window.customElements.define( 'app-slide', AppSlide )
window.customElements.define( 'app-module', AppModule )
window.customElements.define( 'app-container', AppContainer )