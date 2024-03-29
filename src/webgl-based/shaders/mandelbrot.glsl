precision mediump float;

vec4 getMandelbrotColor(vec2 c);
vec4 colorGradient(const float value);
vec2 canvasToMandelbrotCoord(const vec2 canvasCoord);

uniform vec2 CANVAS_SIZE;
vec2 CANVAS_OFFSET = CANVAS_SIZE / vec2(2);

uniform vec2 offset;
uniform vec2 scale;

const int MAX_ITERATION = 100000;
uniform int maxIteration;

void main() {
  vec2 c = canvasToMandelbrotCoord(gl_FragCoord.xy);
  gl_FragColor = getMandelbrotColor(c);
}

vec4 getMandelbrotColor(vec2 c) {
  vec2 p = c;

  for(int i = 0; i <= MAX_ITERATION; i++) {
    if(i > maxIteration) {
      break;
    }

    p = vec2(p.x * p.x - p.y * p.y, 2.0 * p.x * p.y) + c;

    if(length(p) > 2.0) {
      return colorGradient(float(maxIteration - i) / float(maxIteration));
    }
  }

  return vec4(0.0, 0.0, 0.0, 1.0);
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

vec2 canvasToMandelbrotCoord(const vec2 canvasCoord) {
  return (canvasCoord - CANVAS_OFFSET) / scale - offset;
}