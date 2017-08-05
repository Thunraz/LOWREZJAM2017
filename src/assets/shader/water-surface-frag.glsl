precision highp float;
precision highp int;

uniform float time;
uniform vec2 resolution;
uniform vec3 uPosition;

varying vec2 vUv;
varying vec3 vPosition;

void main(void)
{
    vec2 uv = uPosition.xz + vUv.xy / resolution.xy;
    gl_FragColor = vec4(uPosition.xyz, 1.0);
    //gl_FragColor = vec4(0.5 + 0.5 * sin(time), 0.0, 1.0, 1.0);
}