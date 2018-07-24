uniform sampler2D letterTxtr;
uniform sampler2D reflectionTxtr;

varying vec2 vUv;

void main(){
	vec4 res = texture2D( reflectionTxtr, vUv );
	vec4 letterRes = texture2D( letterTxtr, vUv );

	vec4 c = res * ( 1.0 - letterRes.a );

	c += letterRes;

	gl_FragColor = c;
}