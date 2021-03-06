/**
 * Defines a wire frame cube with functions for drawing it.
 */
const DIMENSIONS = 3
class Cube {
    constructor(gl, ctx, x, y, z, width, height, depth) {
        this.gl = gl;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.rad = 0
        this.r_x = 1
        this.r_y = 0
        this.r_z = 0

        this.positionBuffer = -1;

        this.verticeIndexCount = 0;

        this.setUpBuffers();
    }

    rotate(rad, x, y, z) {
        this.rad = (this.rad + rad) % (2 * Math.PI)
        this.r_x = x
        this.r_y = y
        this.r_z = z
    }

    setUpBuffers() {
        //   v7-------v6
        //   /|      /|
        //  / |     / |
        // v3------v2 |
        // | v4----|--v5
        // | /     | /
        // v0------v1
        // positions
        const vertices = [
            // X Y Z
            // back
            -0.5, -0.5, -0.5,       // v0
             0.5, -0.5, -0.5,       // v1
             0.5,  0.5, -0.5,       // v2
            -0.5,  0.5, -0.5,       // v3
            // front
            -0.5, -0.5, 0.5,        // v4
             0.5, -0.5, 0.5,        // v5
             0.5,  0.5, 0.5,        // v6
            -0.5,  0.5, 0.5,        // v7
            // right
             0.5, -0.5, -0.5,       // v8  = v1
             0.5,  0.5, -0.5,       // v9  = v2
             0.5,  0.5,  0.5,       // v10 = v6
             0.5, -0.5,  0.5,       // v11 = v5
            // left
            -0.5, -0.5, -0.5,       // v12 = v0
            -0.5,  0.5, -0.5,       // v13 = v3
            -0.5,  0.5,  0.5,       // v14 = v7
            -0.5, -0.5,  0.5,       // v15 = v4
            // top
            -0.5, 0.5, -0.5,        // v16 = v3
            -0.5, 0.5,  0.5,        // v17 = v7
             0.5, 0.5,  0.5,        // v18 = v6
             0.5, 0.5, -0.5,        // v19 = v2
            //bottom
            -0.5, -0.5, -0.5,       // v20 = v0
            -0.5, -0.5,  0.5,       // v21 = v4
             0.5, -0.5,  0.5,       // v22 = v5
             0.5, -0.5, -0.5        // v23 = v1
        ];

        // define the triangles for the cube, there are 2 triangles per side
        const vertexIndices = [
            0,2,1, // face 0 (back)
            2,0,3,
            4,5,6, // face 1 (front)
            4,6,7,
            8,9,10, // face 2 (right)
            10,11,8,
            12,15,14, // face 3 (left)
            14,13,12,
            16,17,18, // face 4 (top)
            18,19,16,
            20,23,22, // face 5 (bottom)
            22,21,20
        ];

        this.setUpPositionBuffer(vertices);
        this.setUpEdgeBuffer(vertexIndices);
    }

    setUpPositionBuffer(vertices) {
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.positionBuffer = buffer;
    }

    setUpEdgeBuffer(vertexIndices) {
        this.verticeIndexCount = vertexIndices.length;
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), this.gl.STATIC_DRAW);
    }

    bindBuffers() {
        // position 3x4 bytes
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(this.ctx.aVertexPositionId, DIMENSIONS, this.gl.FLOAT, false, 0,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexPositionId);
    }

    draw() {
        // Set up the model coordinates
        // translate -> rotate -> draw
        let modelMat = mat4.create();
        mat4.translate(modelMat, modelMat, vec3.fromValues(this.x, this.y, this.z));
        mat4.rotate(modelMat, modelMat, this.rad, vec3.fromValues(this.r_x, this.r_y, this.r_z))
        mat4.scale(modelMat, modelMat, vec3.fromValues(this.width, this.height, this.depth));
        this.gl.uniformMatrix4fv(this.ctx.uModelMatId, false, modelMat);

        this.bindBuffers()

        this.gl.drawElements(this.gl.TRIANGLES, this.verticeIndexCount, this.gl.UNSIGNED_SHORT, 0);
    }
}

export { Cube };