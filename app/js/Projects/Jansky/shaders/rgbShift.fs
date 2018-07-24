uniform sampler2D tDiffuse;
uniform float amount;
uniform float angle;
varying vec2 vUv;
void main() {
	vec2 offset = amount * vec2( cos(angle), sin(angle));
	vec4 cr = texture2D(tDiffuse, vUv + offset);
	vec4 cga = texture2D(tDiffuse, vUv);
	vec4 cb = texture2D(tDiffuse, vUv - offset);
	float c = ( cr.r + cga.g + cb.b ) / 3.0;
	gl_FragColor = vec4( vec3( c ), cga.a);
}