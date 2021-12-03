import './style.css'
import * as THREE from 'three'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

/**
 * Font Loader
 */
const fontLoader = new FontLoader()
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Hola Sofia!', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 4,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.02,
        bevelSegments: 4
    })

    textGeometry.center()

    const textMaterial = new THREE.MeshMatcapMaterial({matcap: texture})
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(textMesh)

    const torusGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
    const torusMaterial = new THREE.MeshMatcapMaterial({matcap: torusTexture})

    // add torus
    for (let i = 0; i < 100; i++) {
        const torus = new THREE.Mesh(torusGeometry, torusMaterial)
        torus.position.x = Math.random() * 10 - 5
        torus.position.y = Math.random() * 10 - 5
        torus.position.z = Math.random() * 10 - 5

        torus.rotation.x = Math.random() * Math.PI
        torus.rotation.y = Math.random() * Math.PI

        const scale = Math.random() * 0.5 + 0.5

        torus.scale.x = scale
        torus.scale.y = scale
        torus.scale.z = scale
        scene.add(torus)
    }
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('textures/matcaps/4.png')
const torusTexture = textureLoader.load('textures/matcaps/7.png')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()