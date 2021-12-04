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

// Fog
const fog = new THREE.Fog(0x262837, 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorAoTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')

const wallColorTexture = textureLoader.load('textures/bricks/color.jpg')
const wallNormalTexture = textureLoader.load('textures/bricks/normal.jpg')
const wallRoughnessTexture = textureLoader.load('textures/bricks/roughness.jpg')
const wallAoTexture = textureLoader.load('textures/bricks/ambientOcclusion.jpg')

const grassColorTexture = textureLoader.load('textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('textures/grass/roughness.jpg')
const grassAoTexture = textureLoader.load('textures/grass/ambientOcclusion.jpg')

grassColorTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)
grassAoTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassAoTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
grassAoTexture.wrapT = THREE.RepeatWrapping


/**
 * House
 */

const house = new THREE.Group()
scene.add(house)

const wallsCube = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        roughnessMap: wallRoughnessTexture,
        aoMap: wallAoTexture,
    })
)
wallsCube.position.y = 1.25

wallsCube.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(wallsCube.geometry.attributes.uv.array, 2)
)


const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.4, 1, 4),
    new THREE.MeshStandardMaterial({
        color: 0xb35f45,
    })
)

roof.position.y = 3
roof.rotation.y = Math.PI / 4

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 64, 64),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        normalMap: doorNormalTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        aoMap: doorAoTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        displacementMap: doorHeightTexture,
        displacementScale: 0.05,
    })
)

door.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(door.geometry.attributes.uv.array, 2)
)

door.position.y = 1.0
door.position.z = 2.01

house.add(wallsCube, roof, door)

// bushes
const bushGeomety = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0x89c854,
})

const bush1 = new THREE.Mesh(bushGeomety, bushMaterial)
const bush2 = new THREE.Mesh(bushGeomety, bushMaterial)
const bush3 = new THREE.Mesh(bushGeomety, bushMaterial)
const bush4 = new THREE.Mesh(bushGeomety, bushMaterial)

bush1.scale.set(0.5, 0.5, 0.5)
bush2.scale.set(0.25, 0.25, 0.25)
bush3.scale.set(0.2, 0.2, 0.2)
bush4.scale.set(0.3, 0.3, 0.3)

bush1.position.set(0.8, 0.2, 2.2)
bush2.position.set(1.4, 0.1, 2.1)
bush3.position.set(-1.4, 0.05, 2.1)
bush4.position.set(-1, 0.2, 2.2)

house.add(bush1, bush2, bush3, bush4)

// Graveyard
const graveyard = new THREE.Group()
scene.add(graveyard)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: 0xb2b6b1,
})

for(let i = 0; i < 40; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 5 + 4
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    grave.position.set(x, 0.35, z)
    grave.rotation.y = (Math.random() - 0.5) * Math.PI / 8
    grave.rotation.z = (Math.random() - 0.5) * Math.PI / 8
    graveyard.add(grave)
    grave.castShadow = true
    grave.receiveShadow = true
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial(
        {
            map: grassColorTexture,
            normalMap: grassNormalTexture,
            roughnessMap: grassRoughnessTexture,
            aoMap: grassAoTexture,
        }
    )
)

floor.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2)
)


floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)

house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)

const ghost2 = new THREE.PointLight('#00ffff', 2.5, 3)

const ghost3 = new THREE.PointLight('#ffff00', 3, 3)

scene.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor(0x262837)

/**
 * shadows
 */

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
renderer.shadowMap.enabled = true
wallsCube.castShadow = true
roof.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

wallsCube.receiveShadow = true

// optimize shadows
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

renderer.shadowMap.type = THREE.PCFSoftShadowMap


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const ghostAngle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghostAngle) * 4
    ghost1.position.z = Math.sin(ghostAngle) * 4
    ghost1.position.y = Math.sin(ghostAngle * 4) * 2
    // ghost2
    const ghost2Angle = -elapsedTime * 0.33
    ghost2.position.x = Math.cos(ghost2Angle) * 4.5
    ghost2.position.z = Math.sin(ghost2Angle) * 4.5
    ghost2.position.y = Math.sin(ghost2Angle * 3) * Math.sin(ghost2Angle * 4) * 2
    // ghost3
    const ghost3Angle = elapsedTime * 0.66
    ghost3.position.x = Math.cos(ghost3Angle) * (5 + Math.sin(ghost3Angle * 2) * 0.5)
    ghost3.position.z = Math.sin(ghost3Angle) * (5 + Math.sin(ghost3Angle * 2) * 0.5)
    ghost2.position.y = Math.sin(ghost3Angle * 4) * Math.sin(ghost3Angle * 2.4) * 4

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()