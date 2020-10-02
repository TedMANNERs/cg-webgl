attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;

varying vec4 vColor;

uniform mat3 uProjectionMat;
uniform mat3 uModelMat;

void main () {
    gl_Position = uProjectionMat * vec3(aVertexPosition, 1);
    vColor = aVertexColor;
}