uniform samplerCube tCube;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;
varying vec3 p;

void main() {

	vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
	vec4 refractedColor = vec4( 1.0 );

	refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
	refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
	refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

	vec4 c = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );

	float gray = dot( c.rgb, vec3( 0.299, 0.587, 0.114 ) );

	if( gray < 0.39981 ) gray = 0.2;
	if( gray > 0.64453 ) gray = 1.0;

	vec3 c1 = vec3( gray, 0.0, 1.0 ) * ( ( (p.x + 100.0) + (p.y + 100.0) ) ) / 100.0 * gray * gray;
	vec3 c2 = vec3( gray * 0.7, 0.0, 0.0 ) * ( -( p.x + p.y ) ) / 50.0 * gray;

	gl_FragColor = vec4( c1 + c2, 1.0 );

}