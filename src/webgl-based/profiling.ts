import { throwError, assert } from "../assertions";

export function measure(gl: WebGL2RenderingContext, f: () => void) {
  const ext = gl.getExtension("EXT_disjoint_timer_query_webgl2");
  const query = gl.createQuery() ?? throwError();

  gl.beginQuery(ext.TIME_ELAPSED_EXT, query);
  f();
  gl.endQuery(ext.TIME_ELAPSED_EXT);

  return query;
}

export function readMeasurement(gl: WebGL2RenderingContext, query: WebGLQuery) {
  const available = gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE);
  assert(available);

  const elapsedNanos = gl.getQueryParameter(query, gl.QUERY_RESULT);
  console.log(elapsedNanos / 1_000_000);
}
