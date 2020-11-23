attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTextureCoord;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

uniform mat4 uProjectionMat;
uniform mat4 uViewMat;
uniform mat4 uModelMat;
uniform mat3 uNormalMatrix;

void main () {
    vec4 vertexPositionEye4 = uViewMat * uModelMat * vec4(aVertexPosition, 1);// HNF Vector
    vVertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

    // calculate the normal vector in eye coordinates
    vNormalEye = normalize(uNormalMatrix * aVertexNormal);

    // calculate the projected position
    gl_Position = uProjectionMat * vertexPositionEye4;

    // transform and calculate texture coordinates
    vTextureCoord = aVertexTextureCoord;

    // set color for fragment shaded
    vColor = aVertexColor;
}