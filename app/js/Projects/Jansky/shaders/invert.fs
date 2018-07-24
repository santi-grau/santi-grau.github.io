uniform sampler2D tDiffuse;
uniform bool on;
varying vec2 vUv;

void main(){
	vec3 col = texture2D( tDiffuse, vUv ).rgb;
	vec2 uv = vUv;
	uv *=  1.0 - uv.yx;
	
	if( on ) gl_FragColor = vec4( vec3( (1.0 - col ) * ( pow( uv.x * uv.y * 0.99, 0.7) + 0.85 ) ), 1.0 );
	else gl_FragColor = vec4( vec3( col + ( pow( uv.x * uv.y * 0.8, 0.8 ) ) ), 1.0 );
}