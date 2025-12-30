precision mediump float;

uniform vec3 iResolution;
uniform float iTime;

// Retro CRT-inspired scanline grid.
float box(vec2 uv, float thickness) {
  vec2 d = abs(fract(uv - 0.5) - 0.5) / thickness;
  return step(1.0, max(d.x, d.y));
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 aspectUv = uv * vec2(iResolution.x / iResolution.y, 1.0);
  float time = iTime * 0.25;

  float grid = box(aspectUv * 12.0 + time, 0.48);
  float scan = 0.5 + 0.5 * sin((uv.y + time * 0.8) * 240.0);
  float glow = smoothstep(0.0, 0.04, 0.5 - abs(fract(time + uv.x * 0.25) - 0.5));

  vec3 color = mix(vec3(0.06, 0.09, 0.14), vec3(0.05, 0.58, 1.0), scan * 0.5 + glow * 0.6);
  color *= 0.4 + 0.6 * grid;
  gl_FragColor = vec4(color, 1.0);
}
