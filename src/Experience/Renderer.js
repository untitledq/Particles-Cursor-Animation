import * as THREE from 'three'
import Experience from './Experience.js'

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.instance = new THREE.WebGLRenderer({ canvas: this.experience.canvas, antialias: true })
        this.instance.setClearColor('#181818')
        this.resize()
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.instance.render(this.experience.scene, this.experience.camera.instance)
    }

    destroy()
    {
        this.instance.dispose()
    }
}
