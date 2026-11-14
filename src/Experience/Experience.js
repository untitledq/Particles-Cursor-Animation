import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Resources from './Utils/Resources.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import sources from './sources.js'

let instance = null

export default class Experience
{
    constructor(canvas)
    {
        // All components share the same scene and resources.
        if(instance) return instance
        if(!canvas) throw new Error('Experience needs a canvas on first initialization.')
        instance = this

        this.canvas = canvas
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        this.sizes.on('resize', () => this.resize())
        this.time.on('tick', () => this.update())
        // Start loading after World has registered its ready listener.
        this.resources.load()
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        this.world.resize()
    }

    update()
    {
        // Update the camera before raycasting, then render the scene.
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy()
    {
        // Stop updates before releasing scene objects and shared resources.
        this.time.destroy()
        this.sizes.destroy()
        this.world.destroy()
        this.resources.destroy()
        this.camera.destroy()
        this.renderer.destroy()
        instance = null
    }
}
