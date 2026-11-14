import * as THREE from 'three'
import Experience from '../Experience.js'
import particlesVertexShader from '../../shaders/particles/vertex.glsl'
import particlesFragmentShader from '../../shaders/particles/fragment.glsl'

export default class Particles
{
    constructor(displacement)
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.geometry = new THREE.PlaneGeometry(10, 10, 128, 128)
        // Draw each geometry point once; the shader does not need normals.
        this.geometry.setIndex(null)
        this.geometry.deleteAttribute('normal')
        
        // Stable random values give each particle its own strength and direction.
        const intensitiesArray = new Float32Array(this.geometry.attributes.position.count)
        const anglesArray = new Float32Array(this.geometry.attributes.position.count)
        
        for(let i = 0; i < this.geometry.attributes.position.count; i++){
            intensitiesArray[i] = Math.random()
            anglesArray[i] = Math.random() * Math.PI * 2
        }
        
        this.geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
        this.geometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1))
        
        this.material = new THREE.ShaderMaterial({
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            uniforms:
            {
                uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)),
        
                uPictureTexture: new THREE.Uniform(this.experience.resources.items.pictureTexture),
        
                uDisplacementTexture: new THREE.Uniform(displacement.texture)
            }
        })
        this.points = new THREE.Points(this.geometry, this.material)
        this.experience.scene.add(this.points)
    }

    resize()
    {
        // The shader calculates point size in physical screen pixels.
        this.material.uniforms.uResolution.value.set(
            this.sizes.width * this.sizes.pixelRatio,
            this.sizes.height * this.sizes.pixelRatio
        )
    }

    destroy()
    {
        this.points.removeFromParent()
        this.geometry.dispose()
        this.material.dispose()
    }
}
