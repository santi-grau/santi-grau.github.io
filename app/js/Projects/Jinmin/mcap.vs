varying vec2 vUv;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec3 vNormal;
varying vec3 vU;
varying vec2 vN;

void main() {
	vec3 tangent;
	vec3 c1 = cross(normal, vec3(0.0, 0.0, 1.0)); 
	vec3 c2 = cross(normal, vec3(0.0, 1.0, 0.0)); 

	if( length(c1) > length(c2) ) tangent = c1;	
	else tangent = c2;

	vU = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
	vN = vec2( 0. );
	
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	vNormal = normalize( normalMatrix * normal );
	
	vTangent = normalize( normalMatrix * tangent.xyz );
	vBinormal = normalize( cross( vNormal, vTangent ) );
}