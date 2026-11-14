import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Experience from './Experience.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 0, 18)
        this.experience.scene.add(this.instance)
        this.controls = new OrbitControls(this.instance, this.experience.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
        // Raycasting needs the current camera matrix before rendering.
        this.instance.updateMatrixWorld()
    }

    destroy()
    {
        this.controls.dispose()
        this.instance.removeFromParent()
    }
}
