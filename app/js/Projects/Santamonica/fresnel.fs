varying vec3 vNormal;

void main() {
	
	float avg = ( ( ( vNormal.x + 1.0 ) / 2.0 ) + ( ( vNormal.y + 1.0 ) / 2.0 ) ) / 2.0;

	if( vNormal.z == 1.0 ) avg = 0.8;
	else avg *= 0.6;

	gl_FragColor = vec4( vec3( avg ), 1.0 );

}