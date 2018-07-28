var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;

var mcapVs = require('./mcap.vs');
var mcapFs = require('./mcap.fs');
var animation = require( './animation' );
var loader = require('./objLoader');
var Composer = require('./Composer');

(function(k){function r(f,p){var e=new k.Vector3,c=new k.Vector3,d=new k.Vector3,a=new k.Vector3,g=new k.Vector3,n=p.vertices[f.a],h=p.vertices[f.b],m=p.vertices[f.c];if(f instanceof k.Face3)return e.subVectors(m,h),c.subVectors(n,h),e.cross(c),e;if(f instanceof k.Face4)return e=p.vertices[f.d],d.subVectors(e,h),c.subVectors(n,h),d.cross(c),a.subVectors(e,m),g.subVectors(h,m),a.cross(g),a.add(d),a.multiplyScalar(.5)}k.OBMLoader=function(f){k.OBJLoader.call(this,f)};k.OBMLoader.prototype=Object.create(k.OBJLoader.prototype);var m;k.OBMLoader.prototype.load=function(f,p,e,c){var d=this,a=new k.FileLoader(d.manager);a.setPath(this.path);a.load(f,function(a){d.loadString(a,p)},e,c)};k.OBMLoader.prototype.loadString=function(f,p){f=this.preprocess(f);var e=this.parse(f);m.vn_autocreate&&e.children.forEach(function(c,d){c.geometry=(new k.Geometry).fromBufferGeometry(c.geometry);c.geometry.mergeVertices();c.geometry.computeVertexNormals();c.geometry=(new k.BufferGeometry).fromGeometry(c.geometry)});m.vn_autocreate_degrees&&e.children.forEach(function(c,d){c.geometry=(new k.Geometry).fromBufferGeometry(c.geometry);c.geometry.mergeVertices();c.geometry.computeVertexNormalsByDegrees(m.vn_autocreate_degrees);c.geometry=(new k.BufferGeometry).fromGeometry(c.geometry)});p(e)};k.OBMLoader.prototype.preprocess=function(f){f=f.replace(/~/g,"//").split("\n");for(var k=[0,0,0],e=[0,0,0],c=[0,0],d,a,g,n,h=0,t=f.length;h<t;h++){var b=f[h].trim().split(" "),l=b.shift();if("v"===l)b[0]=k[0]+parseInt(b[0],10)/a,b[1]=k[1]+parseInt(b[1],10)/a,b[2]=k[2]+parseInt(b[2],10)/a,f[h]="v "+b[0]*m.scale+" "+b[1]*m.scale+" "+b[2]*m.scale,k=b;else if("vn"===l)b[0]=e[0]+parseFloat(b[0])/n,b[1]=e[1]+parseFloat(b[1])/n,b[2]=e[2]+parseFloat(b[2])/n,f[h]="vn "+b[0]+" "+b[1]+" "+b[2],e=b;else if("vt"===l)"undefined"!==typeof c&&(b[0]=c[0]+parseFloat(b[0])/g,b[1]=c[1]+parseFloat(b[1])/g,b[2]=c[2]+parseFloat(b[2])/g,f[h]="vt "+b[0]+" "+b[1]+" "+b[2]),c=b;else if("f"===l){b=b.map(function(a){return a.split("/")});if("undefined"===typeof d)for(d=b.slice(0),l=0;l<b.length;l++)b[l]=b[l].join("/");else{for(var l=0,r=b.length;l<r;l++)for(var q=0,u=b[l].length;q<u;q++)d[l]&&b[l]&&""!==b[l][q]&&(b[l][q]=parseInt(b[l][q],10)+parseInt(d[l][q],10));d=b.slice(0);for(l=0;l<r;l++)b[l]=b[l].join("/")}f[h]="f "+b.join(" ")}else"#"===l&&"INSTRUCTIONS"===b[0]&&(m=JSON.parse(b.slice(1).join(" ")),a=Math.pow(10,m.v_precision),g=Math.pow(10,m.vt_precision),n=Math.pow(10,m.vn_precision))}return f.join("\n")};k.Geometry.prototype.computeVertexNormalsByDegrees=function(f){for(var m=this.faces,e=this.vertices,c=Array(e.length),d=m.length;d--;){var a=m[d],g=a.normal.length(),n=a.vertexNormals;c[a.a]=c[a.a]||[];c[a.a].push({face:a,face_normal_length:g,vertexNormal:n[0],smoothingGroup:[]});c[a.b]=c[a.b]||[];c[a.b].push({face:a,face_normal_length:g,vertexNormal:n[1],smoothingGroup:[]});c[a.c]=c[a.c]||[];c[a.c].push({face:a,face_normal_length:g,vertexNormal:n[2],smoothingGroup:[]});a.d&&(c[a.d]=c[a.d]||[],c[a.d].push({face:a,face_normal_length:g,vertexNormal:n[3],smoothingGroup:[]}))}for(var h,d=0,e=e.length;e--;){if(c[e])for(a=0,i_length=c[e].length;a<i_length;a++){var g=c[e][a],n=c[e][(a+1)%c[e].length],t=g.face.normal.dot(n.face.normal);180*Math.acos(t/(g.face_normal_length*n.face_normal_length))/Math.PI<=f?(h=!0,g.smoothingGroup.push(d),n.smoothingGroup.push(d)):(d++,g.vertexNormal.add(c[e][a].face.normal),n.vertexNormal.add(n.face.normal))}if(h){d=c[e];h={};for(g=d.length;g--;)a=d[g].smoothingGroup[0],h[a]?h[a].averageVec.add(r(d[g].face,this)):h[a]={averageVec:r(d[g].face,this)};2===d[0].smoothingGroup.length&&(a=h[d[0].smoothingGroup[0]],d=h[d[0].smoothingGroup[1]],g=(new k.Vector3).addVectors(a.averageVec,d.averageVec),a.averageVec=g,d.averageVec=g);a=h;for(g=c[e].length;g--;)h=c[e][g],d=h.smoothingGroup[0],void 0!==d&&h.vertexNormal.copy(a[d].averageVec)}h=!1;d=0}for(a=m.length;a--;)for(f=m[a].vertexNormals.length;f--;)m[a].vertexNormals[f].normalize()}})(THREE);

var Jinmin = function( dims, renderer ){
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.dims = dims;

	this.positions = [];
	this.easedPositions = [];
	this.rotation = new THREE.Vector3(0,0,0);
	this.easedRotation = new THREE.Vector3(0,0,0);

	this.camera.position.z = 1000;
	this.camera.position.y = 1500;
	this.camera.position.x = -800
	this.camera.lookAt(new THREE.Vector3(0,0,0))

	this.postRT = new THREE.WebGLRenderTarget( dims.width * 1.4, dims.height * 1.4, {  } );
	this.composer = new Composer( renderer, this.postRT, this.scene, this.camera );

	var loader = new THREE.OBJLoader();

	var tLoader = new THREE.TextureLoader();
	var normalTexture = tLoader.load( window._PATH_ + 'jinmin/norm.jpg' );
	normalTexture.wrapS = THREE.RepeatWrapping;
	normalTexture.wrapT = THREE.RepeatWrapping;

	var matCapTexture = tLoader.load( window._PATH_ + 'jinmin/txtr.jpg' );

	var omloader = new THREE.OBMLoader();
	omloader.load(window._PATH_ + 'jinmin/base.obm', function( object ) {
		for( var i = 0 ; i < object.children.length ; i++ ){
			var block = object.children[i];
			block.material = new THREE.ShaderMaterial( {
				uniforms: { 
					tNormal: { type: 't', value: normalTexture },
					tMatCap: { type: 't', value: matCapTexture },
					useScreen: { type: 'f', value: 0 },
					normalScale: { type: 'f', value: .6 },
					normalRepeat: { type: 'f', value: 3 },
					val : { type: 'f', value: Math.random() * 0.08 + 0.92 }
				},
				vertexShader: mcapVs,
				fragmentShader: mcapFs
			} );
		}

		var scale = Math.min( this.dims.width, this.dims.height ) / 20;
		object.scale.set(scale,scale,scale);
		this.scene.add( object );
		this.emit( 'ready' );
	}.bind(this));
}

inherits( Jinmin, EventEmitter );

Jinmin.prototype.setActive = function( x, y ){
	var blocks = this.scene.children[0];
	for( var i = 0 ; i < blocks.children.length ; i++ ){
		this.positions.push( new THREE.Vector3( 0, 0, 0 ) );
		this.easedPositions.push( new THREE.Vector3( 0, 0, 0 ) );
	}
	this.setMouse( x, y );
}

Jinmin.prototype.setMouse = function( x, y ){
	var v = new THREE.Vector2( 
		Math.abs( ( x * this.dims.width - this.dims.width / 2 ) / ( this.dims.width / 2 ) ), 
		Math.abs( ( y * this.dims.height - this.dims.height / 2 ) / ( this.dims.height / 2 ) )
	);
	
	var anilength = 1200;
	var l = Math.min( 1, v.length() ) * 1200;

	var blocks = this.scene.children[0];
	for( var i = 0 ; i < blocks.children.length ; i++ ){
		var block = blocks.children[i];
		for( var j = 0 ; j < animation.length ; j++ ){
			var ani = animation[ j ];
			if( block.name == ani.name ){
				var keys = ani.keys;
				var inc = 1 - Math.min( 1, Math.max( 0, ( l - keys[ 0 ].time ) / ( keys[ 1 ].time - keys[ 0 ].time ) ) );
				this.positions[i].x = -( keys[1].value[0] - keys[0].value[0] ) * inc;
				this.positions[i].z = ( keys[1].value[1] - keys[0].value[1] ) * inc;
				this.positions[i].y = -( keys[1].value[2] - keys[0].value[2] ) * inc;
			}
		}
	}

	this.rotation.y = ( x - 0.5 ) * Math.PI / 8;
	this.rotation.x = ( y - 0.5 ) * Math.PI / 16;
}

Jinmin.prototype.resize = function( dims ){
	this.dims = dims;
	var camView = { left :  dims.width / -2, right : dims.width / 2, top : dims.height / 2, bottom : dims.height / -2, near : 1000, far : 2500 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.updateProjectionMatrix( );
	
	var scale = Math.min( this.dims.width, this.dims.height ) / 20;
	if( this.scene.children.length ) this.scene.children[0].scale.set(scale,scale,scale);
}

Jinmin.prototype.step = function( time ){

	this.easedRotation.y += ( this.rotation.y - this.easedRotation.y ) * 0.1;
	this.scene.children[0].rotation.y = this.easedRotation.y;

	this.easedRotation.x += ( this.rotation.x - this.easedRotation.x ) * 0.1;
	this.scene.children[0].rotation.x = this.easedRotation.x;

	var blocks = this.scene.children[0];
	for( var i = 0 ; i < blocks.children.length ; i++ ){
		var block = blocks.children[i];
		this.easedPositions[i].x += ( this.positions[i].x - this.easedPositions[i].x ) * 0.1;
		this.easedPositions[i].y += ( this.positions[i].y - this.easedPositions[i].y ) * 0.1;
		this.easedPositions[i].z += ( this.positions[i].z - this.easedPositions[i].z ) * 0.1;
		block.position.set( this.easedPositions[i].x, this.easedPositions[i].y, this.easedPositions[i].z );
	}
}

Jinmin.prototype.render = function( time ){
	this.composer.step( time );
}

module.exports = Jinmin;