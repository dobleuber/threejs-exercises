import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('textures/particles/5.png')

/**
 * Particles
 */
const particleGeometry = new THREE.BufferGeometry()
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const verticesArray = []
const particleCount = 20000
for (let i = 0; i < particleCount * 3; i++)  {
    verticesArray.push((Math.random() - 0.5) * 10)
}
const positions = new Float32Array(verticesArray);
// itemSize = 3 because there are 3 values (components) per vertex
particleGeometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

verticesArray.length = 0
for (let i = 0; i < particleCount * 3; i++) {
    verticesArray.push(Math.random())
}

const colors = new Float32Array(verticesArray);

// itemSize = 3 because there are 3 values (components) per vertex
particleGeometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    alphaMap: particleTexture,
    transparent: true,
    // alphaTest: 0.00001,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
})

const particleMesh = new THREE.Points(particleGeometry, particleMaterial)

scene.add(particleMesh)

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
camera.position.z = 3
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
    particleMesh.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()