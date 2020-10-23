/**
 * Defines a wire frame cube with functions for drawing it.
 */
class WireFrameCube {
    constructor(gl, ctx, x, y, z, width, height, depth, color) {
        this.gl = gl;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.color = color;

        this.positionBuffer = -1;
        this.colorBuffer = -1;

        this.setUpBuffers();
    }

    updateColor(color) {
        this.color = color;
        this.setUpColorBuffer();
    }

    setUpBuffers() {
        this.setUpPositionBuffer();
        this.setUpEdgeBuffer();
        this.setUpColorBuffer();
    }

    setUpPositionBuffer() {
        // positions
        const vertices = [
            -0.5, -0.5, -0.5, //v0 front, left, bottom
            -0.5,  0.5, -0.5, //v1 front, left, top
             0.5,  0.5, -0.5, //v2 front, right, top
             0.5, -0.5, -0.5, //v3 front, right, bottom

            -0.5, -0.5, 0.5, //v4 back, left, bottom
            -0.5,  0.5, 0.5, //v5 back, left, top
             0.5,  0.5, 0.5, //v6 back, right, top
             0.5, -0.5, 0.5, //v7 back, right, bottom
        ];

        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.positionBuffer = buffer;
    }

    setUpEdgeBuffer() {
        // define the edges for the cube, there are 12 edges in a cube
        const vertexIndices = [
            //front
            0, 1,
            1, 2,
            2, 3,
            3, 0,

            //sides
            0, 4,
            1, 5,
            2, 6,
            3, 7,

            //back
            4, 5,
            5, 6,
            6, 7,
            7, 4
        ];
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), this.gl.STATIC_DRAW);
    }

    setUpColorBuffer() {
        const colors = [
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.color.r, this.color.g, this.color.b, this.color.a
        ]
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.colorBuffer = buffer;
    }

    draw() {
        // Set up the model coordinates
        // translate -> rotate -> draw
        let modelMat = mat4.create();
        mat4.fromTranslation(modelMat, vec3.fromValues(this.x, this.y, this.z));
        mat4.scale(modelMat, modelMat, vec3.fromValues(this.width, this.height, this.depth));
        this.gl.uniformMatrix4fv(this.ctx.uModelMatId, false, modelMat);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        // position 2x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexPositionId, 2, this.gl.FLOAT, false, 0,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexPositionId);


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);

        // color 4x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexColorId, 4, this.gl.FLOAT, false, 0,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexColorId);

        this.gl.drawElements(this.gl.LINES, 20, this.gl.UNSIGNED_SHORT, 0);
    }
}

export { WireFrameCube };