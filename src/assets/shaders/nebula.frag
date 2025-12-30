precision highp float;

uniform vec3 iResolution;
uniform float iTime;

// Soft noise-based nebula.
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;
  float t = iTime * 0.08;

  float d = length(uv);
  float n = noise(uv * 3.0 + t * 2.0) + noise(uv * 8.0 - t * 4.0) * 0.5;
  float glow = smoothstep(0.9, 0.2, d) * (0.6 + n * 0.6);

  vec3 col = mix(vec3(0.07, 0.02, 0.15), vec3(0.14, 0.32, 0.61), n);
  col += vec3(0.5, 0.12, 0.72) * glow;
  gl_FragColor = vec4(col, 1.0);
}
