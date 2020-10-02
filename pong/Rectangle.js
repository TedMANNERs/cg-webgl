class Rectangle {
    constructor(gl, ctx) {
        this.gl = gl;
        this.ctx = ctx;
        this.buffer = -1;
    }

    setUpBuffer(x, y, height, width, color) {
        let buffer = this.gl.createBuffer();

        const vertices = [
            0 - height + x, height + y, color.r, color.g, color.b, color.a,
            width + x, width + y, color.r, color.g, color.b, color.a,
            width + x, 0 - width + y, color.r, color.g, color.b, color.a,
            0 - height + x, 0 - height + y, color.r, color.g, color.b, color.a
        ];

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.buffer = buffer;
    }

    draw() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

        // position 2x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexPositionId, 2, this.gl.FLOAT, false, 24,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexPositionId);

        //color 4x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexColorId, 4, this.gl.FLOAT, false, 24,8);
        this.gl.enableVertexAttribArray(this.ctx.aVertexColorId);

        // Set up the world coordinates
        var projectionMat = mat3.create();
        mat3.fromScaling(projectionMat, [2.0/this.gl.drawingBufferWidth, 2.0/this.gl.drawingBufferHeight]);
        this.gl.uniformMatrix3fv(this.ctx.uProjectionMatId, false, projectionMat);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
    }
}

export { Rectangle };