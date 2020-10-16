class Rectangle {
    constructor(gl, ctx, x, y, height, width, color, isHidden=false) {
        this.gl = gl;
        this.ctx = ctx;
        this.positionBuffer = -1;
        this.colorBuffer = -1;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
        this.isHidden = isHidden;

        this.setUpBuffer();
    }

    hide() {
        this.isHidden = true
    }

    show() {
        this.isHidden = false
    }

    updateColor(color) {
        this.color = color;
        this.setUpColorBuffer()
    }

    setUpColorBuffer() {
        let buffer = this.gl.createBuffer();
        const colors = [
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.color.r, this.color.g, this.color.b, this.color.a
        ]
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.colorBuffer = buffer;
    }

    setUpBuffer() {
        let buffer = this.gl.createBuffer();

        // positions
        const vertices = [
            -0.5, -0.5,
             0.5, -0.5,
             0.5,  0.5,
            -0.5,  0.5,
        ];

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.positionBuffer = buffer;
        this.setUpColorBuffer()
    }

    draw() {
        if (this.isHidden)
            return

        // Set up the model coordinates
        // translate -> rotate -> draw
        let modelMat = mat3.create();
        mat3.fromTranslation(modelMat, vec2.fromValues(this.x, this.y));
        mat3.scale(modelMat, modelMat, vec2.fromValues(this.width, this.height));
        this.gl.uniformMatrix3fv(this.ctx.uModelMatId, false, modelMat);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        // position 2x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexPositionId, 2, this.gl.FLOAT, false, 0,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexPositionId);


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);

        // color 4x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexColorId, 4, this.gl.FLOAT, false, 0,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexColorId);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
    }
}

export { Rectangle };