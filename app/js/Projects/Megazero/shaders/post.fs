uniform sampler2D tDiffuse;
varying vec2 vUv;
uniform vec2 resolution;

vec3 gammaCorrect(vec3 color, float gamma){
    return pow(color, vec3(1.0/gamma));
}

vec3 levelRange(vec3 color, float minInput, float maxInput){
    return min(max(color - vec3(minInput), vec3(0.0)) / (vec3(maxInput) - vec3(minInput)), vec3(1.0));
}

vec3 finalLevels(vec3 color, float minInput, float gamma, float maxInput){
    return gammaCorrect(levelRange(color, minInput, maxInput), gamma);
}

float normpdf(in float x, in float sigma){
	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}


void main(){
	vec4 res = texture2D( tDiffuse, vUv );
	vec3 color = finalLevels( res.rgb, 0.0627450, 0.3, 0.8098039216);
	color = vec3( ( color.r + color.g + color.b ) / 3.0 );
	gl_FragColor = vec4( color, res.a );
}