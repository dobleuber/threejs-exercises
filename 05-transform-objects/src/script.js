import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// add a axis helper: to visualize the coordinate system
const axes = new THREE.AxesHelper(2)
scene.add(axes)

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
const mesh = new THREE.Mesh(geometry, material)

// position the cube
mesh.position.set(2, -0.5, -2)

// scale the cube
mesh.scale.set(2, 0.5, 2)

const anotherCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xFF0000 })
)
anotherCube.position.set(-1, -0.5, 0.5)
anotherCube.scale.set(0.5, 0.5, 1)

const anotherCubeBlue = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000FF })
)
anotherCubeBlue.position.set(0, -0.5, -0.5)

// creating a group of objects
const group = new THREE.Group()
group.add(mesh)
group.add(anotherCube)
group.add(anotherCubeBlue)
scene.add(group)

// rotate the cube with rotation, rotation parameter is a euler vector
group.rotation.reorder('YXZ') // change the order of the rotation
group.rotation.set(Math.PI / 4, Math.PI / 2, Math.PI / 2)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.position.y = 2
camera.position.x = 2
scene.add(camera)

camera.lookAt(group.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)