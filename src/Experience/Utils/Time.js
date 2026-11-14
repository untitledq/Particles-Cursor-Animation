import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()
        this.start = performance.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.tick = this.tick.bind(this)
        this.frame = window.requestAnimationFrame(this.tick)
    }

    tick(current)
    {
        this.delta = current - this.current
        this.current = current
        this.elapsed = current - this.start
        this.frame = window.requestAnimationFrame(this.tick)
        this.trigger('tick')
    }

    destroy()
    {
        window.cancelAnimationFrame(this.frame)
        this.callbacks.clear()
    }
}
