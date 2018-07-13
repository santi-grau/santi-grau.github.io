varying vec2 vUv;
uniform vec2 pos;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}