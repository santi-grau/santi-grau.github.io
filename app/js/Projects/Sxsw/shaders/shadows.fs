uniform vec2 resolution;
uniform vec3 camPosition;
uniform mat4 camViewMatrix;
uniform mat4 camInvProjectionMatrix;
uniform vec4 seeds;
uniform float time;
uniform vec2 ps;
varying vec2 vUv;

#define AA 1
#define RENDER_SAMPLES 16
#define SHADOW_SAMPLES 16

struct Ray{
	vec3 org;
	vec3 dir;
};

float random (vec2 st) {
	return fract( sin( dot( st.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453123 );
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v){
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
	vec2 i  = floor(v + dot(v, C.yy) );
	vec2 x0 = v -   i + dot(i, C.xx);
	vec2 i1;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	i = mod289(i); // Avoid truncation effects in permutation
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
	vec3 g;
	g.x  = a0.x  * x0.x  + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

float sdBox( vec3 p, vec3 b ){ vec3 d = abs(p) - b; return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0)); }
float opU( float d1, float d2 ){ return min(d1,d2); }
vec3 fOpRotate( vec3 pos, vec3 r ){
	r *= vec3( -1.0, 1.0, 1.0 );
	mat3 rotateX = mat3( 1.0, 0.0, 0.0, 0.0, cos( r.x ), sin( r.x ), 0.0, -sin( r.x ), cos( r.x ) );
	mat3 rotateY = mat3( cos( r.y ), 0.0, sin( r.y ), 0.0, 1.0, 0.0, -sin( r.y ), 0.0, cos( r.y ) );
	mat3 rotateZ = mat3( cos( r.z ), -sin( r.z ), 0.0, sin( r.z ), cos( r.z ), 0.0, 0.0, 0.0, 1.0 );
	return ( rotateZ * rotateY * rotateX * pos );
}

float scene( vec3 pos ){
	vec3 t1 = -vec3( (random( vec2( seeds.x, seeds.y ) ) * 0.2), -(random( vec2( seeds.y, seeds.z ) ) * 0.2), ps.x * 0.2 );
	vec3 r1 = vec3( -0.1 + ps.y * 0.1, -0.1 - ps.x * 0.2, ps.x * ps.y * 1.5 );
	vec3 s1 = vec3( 0.5 );
	vec3 p1 = fOpRotate( pos + t1, r1 );
	s1.z = 0.00001;
	float b1 = sdBox( p1, s1 * 0.5 );

	vec3 t2 = -vec3( -(random( vec2( seeds.z, seeds.w ) ) * 0.2), random( vec2( seeds.x, seeds.z ) ) * 0.2,  0.2 - ps.x * 0.2 );
	vec3 r2 = vec3( 0.1 - ps.x * 0.1, -0.1 - ps.y * 0.2, -ps.y * 0.5 );
	vec3 s2 = vec3( 0.5 );
	vec3 p2 = fOpRotate( pos + t2, r2 );
	s2.z = 0.00001;
	float b2 = sdBox( p2, s2 * 0.5 );

	return opU( b1, b2 );
}

// calculate scene normal using forward differencing
vec3 sceneNormal( vec3 pos, float d ){
	float eps = 0.0001;
	vec3 n;
	n.x = scene( vec3( pos.x + eps, pos.y, pos.z ) ) - d;
	n.y = scene( vec3( pos.x, pos.y + eps, pos.z ) ) - d;
	n.z = scene( vec3( pos.x, pos.y, pos.z + eps ) ) - d;
	return normalize(n);
}

bool raymarch( Ray ray, out vec3 hitPos, out vec3 hitNrm ){
	const int maxSteps = RENDER_SAMPLES;
	const float hitThreshold = 0.0001;

	bool hit = false;
	hitPos = ray.org;

	vec3 pos = ray.org;

	for ( int i = 0; i < maxSteps; i++ ){
		float d = scene( pos );
		if ( d > 5.0 ) break;
		if ( d < hitThreshold ){
			hit = true;
			hitPos = pos;
			hitNrm = sceneNormal( pos, d );
			break;
		}
		pos += d * ray.dir;
	}
	return hit;
}

float shadowSoft( vec3 ro, vec3 rd, float mint, float maxt, float k ){
	float t = mint;
	float res = 1.0;
	for ( int i = 0; i < SHADOW_SAMPLES; ++i ){
		float h = scene( ro + rd * t );
		if ( h < 0.001 ) return 0.0;
		res = min( res, k * h / t );
		t += h;
		if ( t > maxt ) break;
	}
	return res;
}

vec3 shade( vec3 pos, vec3 nrm, vec4 light ){
	vec3 toLight = light.xyz - pos;
	
	float toLightLen = length( toLight );
	toLight = normalize( toLight );
	
	float comb = 0.0;
	float vis = shadowSoft( pos, toLight, 0.005, toLightLen, 1.0 );
	
	if ( vis > 0.0 ){
		float diff = 2.0 * max( 0.0, dot( nrm, toLight ) );
		float attn = 1.0 - pow( min( 1.0, toLightLen / light.w ), 2.0 );
		comb += diff * attn * vis;
	}
	return vec3( comb );
}

vec3 calcRayDirection( vec2 uv ) {
	vec2 p = uv;
	vec3 rd = (camInvProjectionMatrix * vec4(p, -1.0, 1.0)).xyz;
	rd = (camViewMatrix * vec4(rd, 0.0)).xyz;
	return normalize(rd);
}

void main( ){
	vec4 col = vec4( 0.0, 0.0, 0.0, 0.0 );
	for( int m=0; m<AA; m++ ){
		for( int n=0; n<AA; n++ ){
			vec2 o = vec2( float( m ), float( n ) ) / float( AA ) - 0.5;
			vec2 uv = vUv * 2.0 - 1.0;
			Ray ray;
			ray.org = camPosition;
			ray.dir = calcRayDirection( uv );
			// define the point light in world space (XYZ, range)
			vec4 light1 = vec4( 0.0, 1.0, 5.0, 6.5 );
			vec3 sceneWsPos;
			vec3 sceneWsNrm;
			if ( raymarch( ray, sceneWsPos, sceneWsNrm ) ){
				float shade1 = shade( sceneWsPos, sceneWsNrm, light1 ).r;
				col += vec4( shade1 );
			}
		}
	}
	col /= float( AA * AA );
	gl_FragColor = col;
}