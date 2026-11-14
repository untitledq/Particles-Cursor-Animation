import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Displacement
{
    constructor()
    {
        this.experience = new Experience()
        // This small canvas stores the cursor trail as a displacement texture.
        this.canvas = document.createElement('canvas')
        this.canvas.width = 128
        this.canvas.height = 128
        this.canvas.style.position = 'fixed'
        this.canvas.style.width = '256px'
        this.canvas.style.height = '256px'
        this.canvas.style.top = 0
        this.canvas.style.left = 0
        this.canvas.style.zIndex = 10
        document.body.append(this.canvas)
        
        // Black means no displacement; bright areas push particles away.
        this.context = this.canvas.getContext('2d')
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        
        // The glow image is fully loaded before World creates this component.
        this.glowImage = this.experience.resources.items.glowImage
        
        /**
         * An invisible plane maps the cursor position to image coordinates.
         */
        this.interactivePlane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshBasicMaterial({color: 'red', side: THREE.DoubleSide})
        )
        this.interactivePlane.visible = false
        this.experience.scene.add(this.interactivePlane)
        
        // The ray intersects the plane to obtain its UV coordinates.
        this.raycaster = new THREE.Raycaster()
        
        // Start outside the image to avoid a trail before the first cursor movement.
        this.screenCursor = new THREE.Vector2(9999, 9999)
        this.canvasCursor = new THREE.Vector2(9999, 9999)
        this.canvasCursorPrevious = new THREE.Vector2(9999, 9999)
        
        this.onPointerMove = (event) => {
            // Map screen coordinates to the [-1, 1] range expected by the raycaster.
            this.screenCursor.x = (event.clientX / this.experience.sizes.width) * 2 - 1
            this.screenCursor.y = -(event.clientY / this.experience.sizes.height) * 2 + 1
        }
        window.addEventListener('pointermove', this.onPointerMove)
        
        // Use the canvas directly as a shader texture.
        this.texture = new THREE.CanvasTexture(this.canvas)
    }

    update()
    {
        this.raycaster.setFromCamera(this.screenCursor, this.experience.camera.instance)
        const intersections = this.raycaster.intersectObject(this.interactivePlane)
        if(intersections.length){
            const uv = intersections[0].uv
    
            this.canvasCursor.x = uv.x * this.canvas.width
            // Canvas Y runs downward, while UV Y runs upward.
            this.canvasCursor.y = (1 - uv.y) * this.canvas.height
        }
    
        /**
         * Gradually fade the previous trail with translucent black.
         */
        this.context.globalCompositeOperation = 'source-over'
        this.context.globalAlpha = 0.05
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        
        // Only movement adds brightness; a stationary cursor lets the trail fade.
        const cursorDistance = this.canvasCursorPrevious.distanceTo(this.canvasCursor)
        this.canvasCursorPrevious.copy(this.canvasCursor)
        const alpha = Math.min(cursorDistance * 0.1, 1)
    
        // Lighten blending preserves existing trails when adding the glow image.
        const glowSize = this.canvas.width * 0.25
        this.context.globalCompositeOperation = 'lighten'
        this.context.globalAlpha = alpha
        this.context.drawImage(
            this.glowImage,
            this.canvasCursor.x - glowSize * 0.5,
            this.canvasCursor.y - glowSize * 0.5,
            glowSize,
            glowSize
        )
    
        // Upload canvas changes to the GPU.
        this.texture.needsUpdate = true
    }

    destroy()
    {
        window.removeEventListener('pointermove', this.onPointerMove)
        this.canvas.remove()
        this.interactivePlane.removeFromParent()
        this.interactivePlane.geometry.dispose()
        this.interactivePlane.material.dispose()
        this.texture.dispose()
    }
}
