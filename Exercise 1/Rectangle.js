
// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

function setUpRectangleBuffer(height, width, red, green, blue, alpha) {
    rectangleObject.buffer = gl.createBuffer();

    var vertices = [
        0-height,height,//red,green,blue,alpha,
        width,width,//red,green,blue,alpha,
        width,0-width,//red,green,blue,alpha,
        0-height,0-height,//red,green,blue,alpha
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function drawRectangle() {
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);

    // position 2x4 bytes
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    //color 4x4 bytes
    //gl.vertexAttribPointer(ctx.uColorId, 4, gl.FLOAT, false, 24,8);
    //gl.enableVertexAttribArray(ctx.uColorId);

    gl.drawArrays(gl.TRIANGLE_FAN, 0,4);
}