import Experience from './Experience/Experience.js'

const experience = new Experience(document.querySelector('canvas.webgl'))

// Remove old listeners, animation loops and GPU resources during hot reload.
if(import.meta.hot)
{
    import.meta.hot.dispose(() => experience.destroy())
}
