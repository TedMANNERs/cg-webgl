
function setUpRectangleBuffer(x, y, height, width) {
    var buffer = gl.createBuffer();

    const c1 = { r:1, g:0, b:0, a:1 };
    const c2 = { r:0, g:1, b:0, a:1 };
    const c3 = { r:0, g:0, b:1, a:1 };
    const c4 = { r:0, g:0, b:0, a:1 };
    var vertices = [
        0-height+x,height+y, c1.r,c1.g,c1.b,c1.a,
        width+x,width+y, c2.r,c2.g,c2.b,c2.a,
        width+x,0-width+y, c3.r,c3.g,c3.b,c3.a,
        0-height+x,0-height+y, c4.r,c4.g,c4.b,c4.a
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return { buffer:buffer };
}

function drawRectangle(rectangleObject) {
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);

    // position 2x4 bytes
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 24,0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    //color 4x4 bytes
    gl.vertexAttribPointer(ctx.aVertexColorId, 4, gl.FLOAT, false, 24,8);
    gl.enableVertexAttribArray(ctx.aVertexColorId);

    gl.drawArrays(gl.TRIANGLE_FAN, 0,4);
}