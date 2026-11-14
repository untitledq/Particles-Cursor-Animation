import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super()
        this.update()
        this.onResize = () =>
        {
            this.update()
            this.trigger('resize')
        }
        window.addEventListener('resize', this.onResize)
    }

    update()
    {
        this.width = window.innerWidth
        this.height = window.innerHeight
        // Limit pixel density to reduce GPU load on high-resolution displays.
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    }

    destroy()
    {
        window.removeEventListener('resize', this.onResize)
        this.callbacks.clear()
    }
}
