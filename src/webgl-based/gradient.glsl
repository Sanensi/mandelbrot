precision mediump float;
vec4 colorGradient(const float value);

uniform vec2 screen_size;

void main() {
  vec2 normalized = gl_FragCoord.xy / vec2(screen_size.x, screen_size.y);
  gl_FragColor = colorGradient(normalized.x);
}

vec4 colorGradient(const float value) {
  float black_to_red = smoothstep(0.0, 0.33, value);
  float red_to_blue = smoothstep(0.33, 0.66, value);
  float blue_to_white = smoothstep(0.66, 1.0, value);

  vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), black_to_red);
  color = mix(color, vec3(0.0, 0.0, 1.0), red_to_blue);
  color = mix(color, vec3(1.0, 1.0, 1.0), blue_to_white);

  return vec4(color, 1.0);
}