precision mediump float;
varying vec4 vColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform bool uEnableTexture;

void main() {
    if (uEnableTexture) {
        gl_FragColor = texture2D(uSampler , vTextureCoord);
    }
    else {
        gl_FragColor = vColor;
    }
}