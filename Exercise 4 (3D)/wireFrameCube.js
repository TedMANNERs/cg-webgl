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

        this.verticeIndexCount = 0;

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
        //   v6-------v7
        //   /|      /|
        //  / |     / |
        // v3------v2 |
        // | v5----|--v4
        // | /     | /
        // v0------v1
        // positions
        const vertices = [
            // X Y Z
            // front
            -0.5, -0.5, -0.5, //v0  left,  bottom
             0.5, -0.5, -0.5, //v1  right, bottom
             0.5,  0.5, -0.5, //v2  right, top
            -0.5,  0.5, -0.5, //v3  left,  top

            // back
             0.5, -0.5,  0.5, //v4  left,  bottom
            -0.5, -0.5,  0.5, //v5  right, bottom
            -0.5,  0.5,  0.5, //v6  right, top
             0.5,  0.5,  0.5, //v7  left,  top

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

            // back
            4, 5,
            5, 6,
            6, 7,
            7, 4,

            // sides
            0, 5,
            1, 4,
            2, 7,
            3, 6

        ];
        this.verticeIndexCount = vertexIndices.length;
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

        // position 3x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexPositionId, 3, this.gl.FLOAT, false, 0,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexPositionId);


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);

        // color 4x4 bytes
        this.gl.vertexAttribPointer(this.ctx.aVertexColorId, 4, this.gl.FLOAT, false, 0,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexColorId);

        this.gl.drawElements(this.gl.LINES, this.verticeIndexCount, this.gl.UNSIGNED_SHORT, 0);
    }
}

export { WireFrameCube };