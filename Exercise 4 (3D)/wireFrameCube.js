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
        //   v10------v6/v11     v19------v18
        //   /|      /|          /|      /|
        //  / |     / |         / |     / |
        // v3----v2/v7|        v16----v17 |
        // | v9----|--v5/v8    | v23---|--v22
        // | /     | /         | /     | /
        // v0------v1/v4       v20-----v21
        // positions
        const vertices = [
            // X Y Z
            // front
            -0.5, -0.5, -0.5, //v0  left,  bottom
             0.5, -0.5, -0.5, //v1  right, bottom
             0.5,  0.5, -0.5, //v2  right, top
            -0.5,  0.5, -0.5, //v3  left,  top

            // right
             0.5, -0.5, -0.5, //v4  left,  bottom v1
             0.5, -0.5,  0.5, //v5  right, bottom
             0.5,  0.5,  0.5, //v6  right, top
             0.5,  0.5, -0.5, //v7  left,  top    v2

            // back
             0.5, -0.5,  0.5, //v8  left,  bottom v5
            -0.5, -0.5,  0.5, //v9  right, bottom
            -0.5,  0.5, -0.5, //v10 right, top
             0.5,  0.5,  0.5, //v11 left,  top    v6

            // left
            -0.5, -0.5,  0.5, //v12  left,  bottom v9
            -0.5, -0.5, -0.5, //v13  right, bottom v0
            -0.5,  0.5, -0.5, //v14  right, top    v3
            -0.5,  0.5,  0.5, //v15  left,  top    v10

            // top
            -0.5,  0.5, -0.5, //v16  left,  bottom v3
             0.5,  0.5, -0.5, //v17  right, bottom v2
             0.5,  0.5,  0.5, //v18  right, top    v6
            -0.5,  0.5,  0.5, //v19  left,  top    v10

            // bottom
            -0.5, -0.5, -0.5, //v20  left,  bottom v0
             0.5, -0.5, -0.5, //v21  right, bottom v1
             0.5, -0.5,  0.5, //v22  right, top    v5
            -0.5, -0.5,  0.5, //v23  left,  top    v9
        ];

        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.positionBuffer = buffer;
    }

    setUpEdgeBuffer() {
        // define the edges for the cube, there are 12 edges in a cube
        const vertexIndices = [
            // front
            0, 1,
            1, 2,
            2, 3,
            3, 0,

            // right
            4, 5,
            5, 6,
            6, 7,
            7, 4,

            // back
            8, 9,
            9, 10,
            10, 11,
            11, 8,

            // left
            12, 13,
            13, 14,
            14, 15,
            15, 12,

            // top
            16, 17,
            17, 18,
            18, 19,
            19, 16,

            // bottom
            20, 21,
            21, 22,
            22, 23,
            23, 20,
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

        this.gl.drawElements(this.gl.LINES, 48, this.gl.UNSIGNED_SHORT, 0);
    }
}

export { WireFrameCube };