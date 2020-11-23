/**
 *
 * Define a sphere that can be drawn with texture or color.
 */
class SolidSphere {
    /**
     *
     * @param gl the gl object for which to define the sphere
     * @param ctx the ctx object
     * @param latitudeBands the number of bands along the latitude direction
     * @param longitudeBands the number of bands along the longitude direction
     * @param color the color of the sphere
     *
     */
    constructor(gl, ctx, x, y, z, radius, latitudeBands, longitudeBands, color) {
        this.gl = gl;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.color = color;

        this.numberOfTriangles = latitudeBands * longitudeBands * 2;
        this.buffers = this.bindBuffers(latitudeBands, longitudeBands);
    }

    bindBuffers(latitudeBands, longitudeBands) {
        let sphere = this.defineVerticesAndTexture(latitudeBands, longitudeBands)
        let bufferVertices  = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferVertices);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sphere.vertices), this.gl.STATIC_DRAW);

        let bufferNormals = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferNormals);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sphere.normals), this.gl.STATIC_DRAW);

        let bufferTextures = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferTextures);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sphere.textures), this.gl.STATIC_DRAW);

        let bufferIndices = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere.indices), this.gl.STATIC_DRAW);
        return {
            vertices: bufferVertices,
            normals: bufferNormals,
            textures: bufferTextures,
            indices: bufferIndices
        }
    }

    defineVerticesAndTexture(latitudeBands, longitudeBands) {
        "use strict";
        // define the vertices of the sphere
        let vertices = [];
        let normals = [];
        let textures = [];

        for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            let theta = latNumber * Math.PI / latitudeBands;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                let phi = longNumber * 2 * Math.PI / longitudeBands;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                // position (and normals as it is a unit sphere)
                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;

                // texture coordinates
                let u = 1 - (longNumber / longitudeBands);
                let v = 1 - (latNumber / latitudeBands);

                vertices.push(x);
                vertices.push(y);
                vertices.push(z);

                normals.push(x);
                normals.push(y);
                normals.push(z);

                textures.push(u);
                textures.push(v);
            }
        }
        return {
            vertices: vertices,
            normals: normals,
            textures: textures,
            indices: this.defineIndices(latitudeBands, longitudeBands)
        }
    }

    defineIndices(latitudeBands, longitudeBands) {
        let indices = [];
        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                let first = (latNumber * (longitudeBands + 1)) + longNumber;
                let second = first + longitudeBands + 1;

                indices.push(first);
                indices.push(first + 1);
                indices.push(second);

                indices.push(second);
                indices.push(first + 1);
                indices.push(second + 1);
            }
        }
        return indices;
    }

    draw() {
        "use strict";
        // Set up the model coordinates
        // translate -> rotate -> draw
        let modelMat = mat4.create();
        mat4.translate(modelMat, modelMat, vec3.fromValues(this.x, this.y, this.z));
        mat4.scale(modelMat, modelMat, vec3.fromValues(this.radius, this.radius, this.radius));
        this.gl.uniformMatrix4fv(this.ctx.uModelMatId, false, modelMat);

        // Set up the normal matrix
        let normalMat = mat3.create();
        mat3.normalFromMat4(normalMat, modelMat);
        this.gl.uniformMatrix3fv(this.ctx.uNormalMatrixId, false, normalMat);

        // position
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertices);
        this.gl.vertexAttribPointer(this.ctx.aVertexPositionId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexPositionId);

        // color is directly specified as an attribute here, as it is valid for the whole object
        this.gl.disableVertexAttribArray(this.ctx.aVertexColorId);
        this.gl.vertexAttrib3f(this.ctx.aVertexColorId, this.color.r, this.color.g, this.color.b);

        // normal
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normals);
        this.gl.vertexAttribPointer(this.ctx.aVertexNormalId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexNormalId);

        // elements
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        this.gl.drawElements(this.gl.TRIANGLES, this.numberOfTriangles*3 ,this.gl.UNSIGNED_SHORT, 0);

        // disable attributes
        this.gl.disableVertexAttribArray(this.ctx.aVertexPositionId);
        this.gl.disableVertexAttribArray(this.ctx.aVertexNormalId);
    }
}

export { SolidSphere };