varying vec3 vNormal;
uniform vec3 col;

void main(){

	float avg = ( ( ( abs( vNormal.x ) + 1.0 ) / 2.0 ) + ( ( abs( vNormal.y ) + 1.0 ) / 2.0 ) ) / 2.0;
	if( abs( vNormal.z ) == 1.0 ) avg = 1.0;
	else avg *= 0.8;

	gl_FragColor = vec4( col * avg, 1.0 );
}