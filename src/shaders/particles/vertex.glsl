uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    // Cursor texture brightness controls the displacement strength.
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    // Suppress faint residual trails while keeping the transition smooth.
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);

    vec3 displacement = vec3(
        cos(aAngle) * 0.2,
        sin(aAngle) * 0.2,
        1.0
    );
    displacement = normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 1.5;
    displacement *= aIntensity;

    // Add the offset to preserve the original image layout.
    newPosition += displacement;

    // Transform the local position through world and view space into clip space.
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Image brightness determines particle size and color.
    float pictureIntensity = texture(uPictureTexture, uv).r;

    // Scale with resolution and shrink distant particles for perspective.
    gl_PointSize = 0.2 * pictureIntensity *  uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Pass the calculated color to the fragment shader.
    vColor = vec3(pow(pictureIntensity, 2.0));
}