import {Cube} from "./cube.js";

class ColorCube extends Cube {
    constructor(gl, ctx, x, y, z, width, height, depth, color) {
        super(gl, ctx, x, y, z, width, height, depth);
        this.color = color;

        this.colorBuffer = -1;

        this.setUpColorBuffer();
    }

    updateColor(color) {
        this.color = color;
        this.setUpColorBuffer();
    }

    setUpColorBuffer() {
        const colors = [
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.color.r, this.color.g, this.color.b, this.color.a,
            //RGBA
            0,1,0,1,
            0,1,0,1,
            0,1,0,1,
            0,1,0,1,

            0,0,1,1,
            0,0,1,1,
            0,0,1,1,
            0,0,1,1,

            0,1,1,1,
            0,1,1,1,
            0,1,1,1,
            0,1,1,1,

            1,0,1,1,
            1,0,1,1,
            1,0,1,1,
            1,0,1,1,
        ]
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.colorBuffer = buffer;
    }

    bindBuffers() {
        super.bindBuffers();

        // color 4x4 bytes
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.ctx.aVertexColorId, 4, this.gl.FLOAT, false, 0,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexColorId);
        
        this.gl.uniform1i(this.ctx.uEnableTextureId, 0);
    }
}

export { ColorCube };