import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', (event) => {
    cursor.x = (event.clientX / window.innerWidth) - 0.5
    cursor.y = (event.clientY / window.innerHeight) - 0.5
    // console.log(cursor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,1, 100)

/* OrthographicCamera
const aspectRatio = sizes.width / sizes.height
const cameraPos = 1.5
const camera = new THREE.OrthographicCamera(-cameraPos* aspectRatio, cameraPos * aspectRatio, cameraPos, -cameraPos, 1, 100)
// end ortographic camera
//*/ 

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 5
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.01

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // update camera
    /*
    const cameraSpeed = 4
    const angle = (cursor.x + 1) * Math.PI * 2
    camera.position.x = Math.sin(angle) * cameraSpeed
    camera.position.z = Math.cos(angle) * cameraSpeed
    camera.position.y = -cursor.y * cameraSpeed * 1.5
    camera.lookAt(mesh.position)
    //*/

    // When we are using damping, we need to call controls.update() every frame
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()