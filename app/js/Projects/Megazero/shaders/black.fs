uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vNormal;

// ┌────────────────────────────────────────────────────────────────────┐
// | ASHIMA NOISE
// | Copyright (C) 2011 Ashima Arts. All rights reserved. 
// | Distributed under the MIT License.
// └────────────────────────────────────────────────────────────────────┘
#define M_PI 3.1415926535897932384626433832795
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) { 
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
	vec2 i = floor(v + dot(v, C.yy) );
	vec2 x0 = v - i + dot(i, C.xx);
	vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	i = mod289(i);
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
	m = m*m*m*m ;
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
	vec3 g;
	g.x  = a0.x * x0.x + h.x * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

///////// TV STRIPES
vec4 hash42(vec2 p){
	vec4 p4 = fract(vec4(p.xyxy) * vec4(443.8975,397.2973, 491.1871, 470.7827));
	p4 += dot(p4.wzxy, p4+19.19);
	return fract(vec4(p4.x * p4.y, p4.x*p4.z, p4.y*p4.w, p4.x*p4.w));
}

float hash( float n ){
	return fract(sin(n)*43758.5453123);
}

float n( in vec3 x ){
	vec3 p = floor(x);
	vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	float n = p.x + p.y*57.0 + 113.0*p.z;
	float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y), mix(mix( hash(n+113.0), hash(n+114.0),f.x), mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
	return res;
}

float nn(vec2 p){
	float y = p.y;
	float s = time*2.;
	float v = (n( vec3(y*.01 +s, 1., 1.0) ) + .0) *(n( vec3(y*.011+1000.0+s, 1., 1.0) ) + .0) * (n( vec3(y*.51+421.0+s, 1., 1.0) ) + .0);
	v*= hash42(   vec2(p.x +time*0.01, p.y) ).x +.3 ;
	v = pow(v+.3, 1.);
	if(v<.6) v = 0.;  //threshold
	return v;
}

void main( ){
	vec2 uv = vUv;
	float linesN = 240.; //fields per seconds
	float one_y = resolution.y / linesN; //field line
	uv = floor( uv * resolution.xy / one_y ) * one_y;

	float pn = ( snoise( vec2( vUv.x * 0.5 + time * 500.0, 2.0 * vUv.y * 100.0 - (1.0 - time) * 100.0 ) ) + 1.0 ) / 2.0;
	float pn2 = ( snoise( vec2( 0.2, time * 1000.0 ) ) + 1.0 ) / 2.0;

	float dist = 0.1 * pn2;
	if( pn > 0.91 ) dist = 1.0;

	float col = clamp( 0.4, 1.0, dist +  nn(uv) );
	
	float avg = ( ( ( abs( vNormal.x ) + 1.0 ) / 2.0 ) + ( ( abs( vNormal.y ) + 1.0 ) / 2.0 ) ) / 1.0;
	if( abs( vNormal.z ) == 1.0 ) avg = 1.0;
	else avg *= 0.5;

	gl_FragColor = vec4( vec3( col * avg ),1.0);
}