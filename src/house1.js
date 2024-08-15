import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 30; // Setting camera position for projection of object.
let renderer = new THREE.WebGLRenderer(); // To perform 3D rendering in HTML.
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // To add final scene to DOM

let houseGroup = new THREE.Group(); // Creating group
houseGroup.position.set(-10, 0, -8); // Set position of group (x-axis, y-axis, z-axis).

// To add bricks for home
let geometry = new THREE.BoxGeometry(8, 4, 6 ); // To draw cube shape geometry.
let mesh = new THREE.MeshBasicMaterial({ color: 0x6e638a }); // Add color of cube for appearance of cube.
let cube = new THREE.Mesh(geometry, mesh); // With mesh adding appearance of cube over it.
let edgeLine = new THREE.BoxGeometry(8, 4, 6);
let edges = new THREE.EdgesGeometry(edgeLine); // To have border of cube.
let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff })); // Adding border around bricks
cube.position.set(0, 0, 4);
line.position.copy(cube.position); // Copy of cube position since border needs to be added around cube.
// Adding line and brick to house group
houseGroup.add(line);
houseGroup.add(cube);
scene.add(houseGroup); // Adding house group to scene

// To add roof for home
let roof = new THREE.ConeGeometry(6, 3, 4);  // Correct radialSegments to 4 or higher
let roofMaterial = new THREE.MeshBasicMaterial({ color: 0xd1d665 });
let roofMesh = new THREE.Mesh(roof, roofMaterial);
roofMesh.position.set(0, 3.5, 4);  // Adjusted position to properly place the roof on top of the house
roofMesh.rotation.y = Math.PI / 4;  // Rotate the roof to align with the house
houseGroup.add(roofMesh);

// To add window for home
let windowGeometry = new THREE.PlaneGeometry(1.5, 2, 1.5); // Renamed from "window" to "windowGeometry"
let windowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let windowMesh = new THREE.Mesh(windowGeometry, windowMaterial); // Renamed from "windowMesh"
windowMesh.position.set(-2.5, 0.25, 7.2);
houseGroup.add(windowMesh);

// To add back window for home
let backWindowGeometry = new THREE.PlaneGeometry(1.5, 2, 1.5);
let backWindowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let backWindowMesh = new THREE.Mesh(backWindowGeometry, backWindowMaterial); 
backWindowMesh.position.set(-2.5, 0.25, 0.85);
houseGroup.add(backWindowMesh);

// To add door for home
let door = new THREE.PlaneGeometry(2, 3, 2);
let doorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let doorMesh = new THREE.Mesh(door, doorMaterial);
doorMesh.position.set(1, -0.45, 7.2);
houseGroup.add(doorMesh);

// To change background color of scene from black to blue
scene.background = new THREE.Color(0x030124);

// Navigate with OrbitConrols
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(0, 0, 0);  // Set the point the camera should orbit around
orbitControls.update();  // Update controls to apply changes

function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();  // Update the controls in each frame
    renderer.render(scene, camera);
  }
  
  animate();

// Add this at end of main.js and add all code above this so that whatever things we are adding will be automatically rendered
renderer.render(scene, camera); 