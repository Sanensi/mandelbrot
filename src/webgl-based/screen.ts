export function setScreenGeometry(
  gl: WebGLRenderingContext,
  positionBufferData: number[],
  positionAttributeLocation: number,
  positionAttributeSize: number,
) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionBufferData),
    gl.STATIC_DRAW,
  );
  gl.vertexAttribPointer(
    positionAttributeLocation,
    positionAttributeSize,
    gl.FLOAT,
    false,
    0,
    0,
  );
}

export function drawScreen(
  gl: WebGLRenderingContext,
  screenVertices: number[],
  positionAttributeSize: number,
) {
  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    0,
    screenVertices.length / positionAttributeSize,
  );
}
