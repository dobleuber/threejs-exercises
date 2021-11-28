console.log('creating our first scene...')

// getting the canvas element
const canvas = document.querySelector('#canvas')

const scene = new THREE.Scene()

// creating a cube mesh
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff8800 })
const cubeMesh = new THREE.Mesh(cubeGeometry, material)

scene.add(cubeMesh)

// sizes
const sizes = {
    width: 800,
    height: 600
}

// creating a camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.y = 1
camera.position.x = 1
scene.add(camera)

// creating a renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
})

renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)


