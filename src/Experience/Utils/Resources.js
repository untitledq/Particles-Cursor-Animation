import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()
        this.sources = sources
        this.items = {}
        this.destroyed = false
        this.loaders = {
            texture: new THREE.TextureLoader(),
            image: new THREE.ImageLoader()
        }
    }

    async load()
    {
        try
        {
            // Build the scene only after all images and textures are available.
            await Promise.all(this.sources.map(async (source) =>
            {
                const item = await this.loaders[source.type].loadAsync(source.path)
                // A pending load may finish after destroy() has already been called.
                if(this.destroyed) item.dispose?.()
                else this.items[source.name] = item
            }))
            if(!this.destroyed) this.trigger('ready')
        }
        catch(error)
        {
            if(!this.destroyed) console.error('Could not load particle resources:', error)
        }
    }

    destroy()
    {
        this.destroyed = true
        this.callbacks.clear()
        Object.values(this.items).forEach((item) => item.dispose?.())
        this.items = {}
    }
}
