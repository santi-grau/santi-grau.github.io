
var Main = function() {
	this.element = document.getElementById('main');

	this.modules = {
		'eina' : {
			'src' : require('./modules/eina'),
			'module' : null
		},
		'ar' : {
			'src' : require('./modules/ar'),
			'module' : null
		}
	};

	var projects = document.getElementsByClassName('project');
	for( var i = 0 ; i < projects.length ; i++ ){
		var elId = projects[i].getAttribute('id');
		var selector = projects[i].firstChild;
		if( this.modules[ elId ] ) this.modules[ elId ].module = new this.modules[ elId ].src( this, selector );
		selector.addEventListener('mousemove', this.mouseMoveOverProject.bind( this ) );
	}

	this.resize();
	this.step();
}

Main.prototype.resize = function( e ) {
	
}

Main.prototype.mouseMoveOverProject = function( e ){
	var parent = e.currentTarget.parentElement;
	var elId = e.currentTarget.parentElement.getAttribute('id');
	var mouseX = ( e.pageX - ( parent.offsetLeft ) ) / ( e.currentTarget.clientWidth );
	var mouseY = ( e.pageY - ( parent.offsetTop ) ) / ( e.currentTarget.clientHeight );
	if( this.modules[ elId ].module.mouseMove )  this.modules[ elId ].module.mouseMove( { x : mouseX, y : mouseY } );
}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	for ( var mod in this.modules ) {
		if( this.modules[mod].module.step )  this.modules[mod].module.step( time );
	}

	// if( this.modules[ elId ].module.step )  this.modules[ elId ].module.step( time );
};

new Main();