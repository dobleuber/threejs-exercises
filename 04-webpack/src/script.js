import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene()

const cubeGeometry = new THREE.BoxGeometry(1,1,1)
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88
})

const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh)

const sizes = {
    width: 400,
    height: 400,
}

// creating a camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.y = 1
camera.position.x = -1

// get the canvas element
const canvas = document.querySelector('#canvas')

// create a renderer
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)
