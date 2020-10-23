attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

varying vec4 vColor;

uniform mat4 uProjectionMat;
uniform mat4 uViewMat;
uniform mat4 uModelMat;

void main () {
    vec4 pos = uProjectionMat * uViewMat * uModelMat * vec4(aVertexPosition, 1);// HNF Vector
    gl_Position = pos;
    vColor = aVertexColor;
}