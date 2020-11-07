attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexTextureCoord;

varying vec4 vColor;
varying vec2 vTextureCoord;

uniform mat4 uProjectionMat;
uniform mat4 uViewMat;
uniform mat4 uModelMat;

void main () {
    vec4 pos = uProjectionMat * uViewMat * uModelMat * vec4(aVertexPosition, 1);// HNF Vector
    gl_Position = pos;

    // transform and calculate texture coordinates
    vTextureCoord = aVertexTextureCoord;

    // set color for fragment shaded
    vColor = aVertexColor;
}