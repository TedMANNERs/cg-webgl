
// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

function setUpRectangleBuffer() {
    rectangleObject.buffer = gl.createBuffer();

    var vertices = [
        -0.1,0.1,
        0.1,0.1,
        0.1,-0.1,
        -0.1,-0.1
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function drawRectangle() {
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);
    gl.drawArrays(gl.TRIANGLE_FAN, 0,4);
}