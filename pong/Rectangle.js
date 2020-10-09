class Rectangle {
    constructor(gl, ctx, x, y, height, width, color) {
        this.gl = gl;
        this.ctx = ctx;
        this.buffer = -1;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;

        this.setUpBuffer();
    }

    setUpBuffer() {
        let buffer = this.gl.createBuffer();
        //let x1 = 0 - this.height + this.x
        //let y1 = 0 - this.height + this.y
        //let x2 = this.width + this.x
        //let y2 = this.width + this.y
        //let y3 = 0 - this.width + this.y
        let r = this.color.r;
        let g = this.color.g;
        let b = this.color.b;
        let a = this.color.a;

        const vertices = [
            -0.5, -0.5, r, g, b, a,
            0.5, -0.5, r, g, b, a,
            0.5, 0.5, r, g, b, a,
            -0.5, 0.5, r, g, b, a
        ];

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.buffer = buffer;
    }

    draw() {
        // Set up the model coordinates
        // translate -> rotate -> draw
        let modelMat = mat3.create();
        mat3.fromTranslation(modelMat, vec2.fromValues(this.x, this.y));
        mat3.scale(modelMat, modelMat, vec2.fromValues(this.width, this.height));
        this.gl.uniformMatrix3fv(this.ctx.uModelMatId, false, modelMat);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

        // position 2x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexPositionId, 2, this.gl.FLOAT, false, 24,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexPositionId);

        // color 4x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexColorId, 4, this.gl.FLOAT, false, 24,8);
        this.gl.enableVertexAttribArray(this.ctx.aVertexColorId);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
    }
}

export { Rectangle };