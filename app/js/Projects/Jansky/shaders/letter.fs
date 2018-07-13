varying vec2 vUv;

uniform sampler2D tex;
uniform vec4 lookAt;

float remap(float value, float istart, float istop, float ostart, float ostop) {
	return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

void main( ){
	vec4 col = vec4( 0.99, 0.92, 0.95, 0.0 );
	
	float u = remap( vUv.x, 0.0, 1.0, lookAt.x, lookAt.x + lookAt.z );
	float v = remap( vUv.y, 0.0, 1.0, lookAt.y, lookAt.y + lookAt.w );
	
	col.a = texture2D( tex, vec2(u, v) ).a;
	
	gl_FragColor = col;
}