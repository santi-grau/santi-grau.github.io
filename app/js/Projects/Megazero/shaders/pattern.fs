varying float vcol;
uniform vec3 seed;
varying vec3 vNormal;

void main(){


	float avg = ( ( ( abs( vNormal.x ) + 1.0 ) / 2.0 ) + ( ( abs( vNormal.y ) + 1.0 ) / 2.0 ) ) / 2.0;
	if( abs( vNormal.z ) == 1.0 ) avg = 1.0;
	else avg *= 0.8;

	gl_FragColor = vec4( vec3( floor( vcol + 0.5 ) * avg ), 1.0 );
}