import {Cube} from "./cube.js";

class TextureCube extends Cube {
    constructor(gl, ctx, x, y, z, width, height, depth, texturePath) {
        super(gl, ctx, x, y, z, width, height, depth);
        this.textureObj = -1;
        this.textureBuffer = -1;

        this.loadTexture(texturePath)
        this.setUpTextureBuffer();
    }

    setUpTextureBuffer() {
        let textureCoord = [
            // back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ]

        let textureBuffer = this.gl.createBuffer ();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER , textureBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER , new Float32Array(textureCoord), this.gl.STATIC_DRAW);
        this.textureBuffer = textureBuffer;
    }

    bindBuffers() {
        super.bindBuffers();
        // texture
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.vertexAttribPointer(this.ctx.aVertexTextureCoordId, 2, this.gl.FLOAT, false, 0,0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexTextureCoordId);

        // enable texture mapping
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D , this.textureObj);
        this.gl.uniform1i(this.ctx.uSamplerId , 0);
        this.gl.uniform1i(this.ctx.uEnableTextureId, 1);
    }

    /**
     * Initialize a texture from an image
     * @param image the loaded image
     * @param textureObject WebGL Texture Object
     */
    initTexture(image, textureObject) {
        // create a new texture
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureObject);
        // set parameters for the texture
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        // turn texture off again
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    /**
     * Load an image as a texture
     */
    loadTexture(texturePath) {
        let image = new Image();
        // create a texture object
        this.textureObj = this.gl.createTexture();
        image.onload = () => {
            this.initTexture(image, this.textureObj);
        };
        // setting the src will trigger onload
        image.src = texturePath;
    }
}

export { TextureCube };