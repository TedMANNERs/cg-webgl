precision mediump float;
varying vec4 vColor;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform bool uEnableTexture;
uniform bool uEnableLighting;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

const float ambientFactor = 0.2;
const float shininess = 10.0;
const vec3 specularMaterialColor = vec3(0.4, 0.4, 0.4);

void main() {
    vec4 baseColor = vColor;
    if (uEnableTexture) {
        baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }

    if (uEnableLighting) {
        // calculate light direction as seen from the vertex position
        vec3 lightDirectionEye = normalize(uLightPosition - vVertexPositionEye3);
        vec3 normal = normalize(vNormalEye);

        // ambient lighting
        vec3 ambientColor = ambientFactor * baseColor.rgb;

        // diffuse lighting
        float cos_angle = dot(normal, lightDirectionEye);
        float diffuseFactor = clamp(cos_angle, 0.0, 1.0);
        vec3 diffuseColor = diffuseFactor * baseColor.rgb;

        // specular lighting
        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
            vec3 reflectionDir = normalize(2.0 * cos_angle * normal - lightDirectionEye);
            vec3 eyeDir = normalize(-vVertexPositionEye3);
            float cosPhi = clamp(dot(reflectionDir, eyeDir), 0.0, 1.0);
            float specularFactor = pow(cosPhi, shininess);
            specularColor = specularFactor * baseColor.rgb;
        }

        vec3 color = ambientColor + diffuseColor + specularColor;
        gl_FragColor = vec4(color, baseColor.a);
    }
    else {
        gl_FragColor = baseColor;
    }
}