precision highp float;

uniform vec3 iResolution;
uniform float iTime;
uniform vec2 iMouse;

// Warm gradient animated by time and mouse position.
void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 centered = (uv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);
  float vignette = smoothstep(0.9, 0.2, length(centered));

  float wave = sin(iTime * 0.6 + uv.y * 6.0) * 0.04;
  float horizon = smoothstep(0.32 + wave, 0.35 + wave, uv.y);

  vec3 skyA = vec3(0.99, 0.58, 0.43);
  vec3 skyB = vec3(0.42, 0.07, 0.23);
  vec3 sun = vec3(1.0, 0.82, 0.52) * smoothstep(0.03, 0.0, length(uv - vec2(0.5, 0.55)));

  float mouseGlow = smoothstep(0.18, 0.0, distance(uv, iMouse / iResolution.xy));
  vec3 color = mix(skyB, skyA, uv.y + wave);
  color += sun;
  color += vec3(0.35, 0.25, 0.6) * horizon;
  color += mouseGlow * 0.25;
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
