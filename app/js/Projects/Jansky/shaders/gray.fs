uniform sampler2D tDiffuse;
varying vec2 vUv;

void main(){
	vec4 col = texture2D( tDiffuse, vUv );
	float c = ( col.r + col.g + col.b ) / 3.0;

	gl_FragColor = vec4( vec3( c ), col.a );
}