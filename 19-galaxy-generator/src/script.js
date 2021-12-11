import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Vector3 } from 'three'

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
 * Galaxy
 */

const parameters = {
    count: 10000,
    particleSize: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: 0x4488ff,
    outsideColor: 0xff8800,
}

let geometry = null
let galaxyMaterial = null
let points = null

const generateGalaxy = () => {
    /**
     * Cleanup
     */
    if (geometry !== null) {
        geometry.dispose()
        galaxyMaterial.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    const angle = Math.PI * 2 / parameters.branches
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        // Positions
        const randomRadius = Math.random() * parameters.radius
        const branch = Math.floor(Math.random() * parameters.branches)
        const spinAngle = randomRadius * parameters.spin
        const randomX = (Math.random() < 0.5 ? -1 : 1) * Math.pow(Math.random(), parameters.randomnessPower) 
        const randomY = (Math.random() < 0.5 ? -1 : 1) * Math.pow(Math.random(), parameters.randomnessPower)
        const randomZ = (Math.random() < 0.5 ? -1 : 1) * Math.pow(Math.random(), parameters.randomnessPower)
        positions[i3] = Math.cos(branch * angle + spinAngle ) * randomRadius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branch * angle + spinAngle ) * randomRadius + randomZ

        // Colors
        const mixedColor = insideColor.clone().lerp(outsideColor, randomRadius / parameters.radius)
        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    galaxyMaterial = new THREE.PointsMaterial({
        sizeAttenuation: true,
        size: parameters.particleSize,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, galaxyMaterial)
    scene.add(points)
}

generateGalaxy()

gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'particleSize').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onChange(generateGalaxy)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)
camera.position.x = 3
camera.position.y = 3
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
    points.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()