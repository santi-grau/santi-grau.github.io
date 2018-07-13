uniform sampler2D faces;
uniform vec2 resolution;
uniform vec2 pos;
uniform vec2 current;
uniform vec2 imSize;
varying vec2 vUv;

void main( ){
	float screenAR = resolution.y / resolution.x;
	vec2 lookAt;
	if( screenAR < 1.0 ) lookAt = vUv * vec2( imSize.x, imSize.y * screenAR ) + vec2( imSize.x * current.x, imSize.y * current.y ) + vec2( 0.0 , ( imSize.y - ( imSize.y * screenAR ) ) * 0.5 );
	else lookAt = vUv * vec2( imSize.x / screenAR, imSize.y ) + vec2( imSize.x * current.x, imSize.y * current.y ) + vec2( ( imSize.x - ( imSize.x / screenAR ) ) * 0.5 , 0.0 );

	vec4 txt = texture2D( faces, lookAt );
	gl_FragColor = vec4( txt.rgb, 1.0 );
}