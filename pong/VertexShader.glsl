attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;

varying vec4 vColor;

uniform mat3 uProjectionMat;
uniform mat3 uModelMat;

void main () {
    vec3 pos = uProjectionMat * uModelMat * vec3(aVertexPosition, 1);// HNF Vector
    gl_Position = vec4(pos.xy / pos.z, 0, 1);
    vColor = aVertexColor;
}