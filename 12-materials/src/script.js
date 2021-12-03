import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ShaderChunk } from 'three'
import * as dat from 'lil-gui'

/**
 * Debugging
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeigthTexture = textureLoader.load('textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')

const matCapTexture = textureLoader.load('textures/matcaps/4.png')

const gradientTexture = textureLoader.load('textures/gradients/5.jpg')

/**
 * Cube Texture loader
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
const enviroMap = cubeTextureLoader.load([
    'textures/environmentMaps/1/px.jpg',
    'textures/environmentMaps/1/nx.jpg',
    'textures/environmentMaps/1/py.jpg',
    'textures/environmentMaps/1/ny.jpg',
    'textures/environmentMaps/1/pz.jpg',
    'textures/environmentMaps/1/nz.jpg',
])

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.alphaMap = doorAlphaTexture
// // material.aoMap = doorAmbientOcclusionTexture
// material.metalnessMap = doorMetalnessTexture
// material.transparent = true
// material.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// material.normalMap = doorNormalTexture
// material.side = THREE.DoubleSide

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matCapTexture

// const material = new THREE.MeshDepthMaterial()

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(ambientLight, pointLight)

// these materials need lights

// const material = new THREE.MeshLambertMaterial()
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
// material.roughnessMap = doorRoughnessTexture
// material.metalnessMap = doorMetalnessTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.map = doorColorTexture
// material.displacementMap = doorHeigthTexture
// material.displacementScale = 0.05
// material.side = THREE.DoubleSide
// material.normalMap = doorNormalTexture
// material.normalScale = new THREE.Vector2(0.5, 0.5)
// material.alphaMap = doorAlphaTexture
// material.transparent = true

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.2
material.metalness = 0.7
material.envMap = enviroMap


gui.add(material, 'metalness', 0, 1)
gui.add(material, 'roughness', 0, 1)
// gui.add(material, 'aoMapIntensity', 0, 5)
// gui.add(material, 'displacementScale', 0, 0.5)


const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
)

sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material
)

plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)

plane.position.x = -1.5
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.4, 0.1, 32, 32),
    material
)

torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)
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

    sphere.rotation.y = elapsedTime * 0.1
    plane.rotation.y = elapsedTime * 0.1
    torus.rotation.y = elapsedTime * 0.1

    sphere.rotation.x = elapsedTime * 0.125
    plane.rotation.x = elapsedTime * 0.125
    torus.rotation.x = elapsedTime * 0.125


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()