uniform sampler2D tDiffuse;
uniform sampler2D noise;
uniform float time;
uniform vec3 amount;
varying vec2 vUv;

void main(){
	vec2 uv = vUv;
	vec2 block = floor( gl_FragCoord.xy / vec2( 16 ) );
	vec2 uv_noise = block / vec2( 64 );
	uv_noise += floor( vec2( time ) * vec2( 1234.0, 3543.0 ) ) / vec2( 64 );
	
	float block_thresh = pow( fract( time  * 1236.0453 ), 2.0 ) * 0.2;
	float line_thresh = pow( fract( time  * 2236.0453 ), 3.0 ) * 0.7;
	
	vec2 uv_r = uv, uv_g = uv, uv_b = uv;

	// glitch some blocks and lines
	if (texture2D(noise, uv_noise).r < block_thresh ||
		texture2D(noise, vec2(uv_noise.y, 0.0)).g < line_thresh) {

		vec2 dist = (fract(uv_noise) - 0.5) * 0.1;
		uv_r += dist * amount.x;
		uv_g += dist * amount.y;
		uv_b += dist * amount.z;
	}

	gl_FragColor.r = texture2D(tDiffuse, uv_r).r;
	gl_FragColor.g = texture2D(tDiffuse, uv_g).g;
	gl_FragColor.b = texture2D(tDiffuse, uv_b).b;

	// loose luma for some blocks
	if (texture2D(noise, uv_noise).g < block_thresh) gl_FragColor.rgb = gl_FragColor.ggg;

	// discolor block lines
	if (texture2D(tDiffuse, vec2(uv_noise.y, 0.0)).b * 3.5 < line_thresh) gl_FragColor.rgb = vec3(0.0, dot(gl_FragColor.rgb, vec3(1.0)), 0.0);
}