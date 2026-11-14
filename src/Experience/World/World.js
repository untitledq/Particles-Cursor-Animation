import Experience from '../Experience.js'
import Displacement from './Displacement.js'
import Particles from './Particles.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        // Particles depends on the canvas texture created by Displacement.
        this.experience.resources.on('ready', () =>
        {
            this.displacement = new Displacement()
            this.particles = new Particles(this.displacement)
        })
    }

    resize()
    {
        this.particles?.resize()
    }

    update()
    {
        this.displacement?.update()
    }

    destroy()
    {
        this.experience.resources.off('ready')
        this.particles?.destroy()
        this.displacement?.destroy()
    }
}
