import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';


// 1. Create the Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB)

// 2. Set Up the Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
// camera.position.z = 50;
camera.position.set(0, 5, 10);  // Move camera higher to raise horizon
camera.lookAt(0, 0, 0);  // Ensure the camera is still looking at the origin

// 3. Create the Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Add light
// Ambient Lighting
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );


// 5. Create Ground
const groundGeometry = new THREE.PlaneGeometry(5000, 5000);  // Large ground plane
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Green color
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal
ground.position.y = 0;  // Slightly lower the ground to avoid z-fighting with the cube
scene.add(ground);

// Create Road
const roadGeometry = new THREE.PlaneGeometry(20, 2000);  // Large ground plane
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Green color
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; 
road.position.set(0, 0, 0);  // Set road to be central between the two rows of buildings
scene.add(road);

// 6. Create a Box Geometry and a Basic Material and Combine them into a Mesh
const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00, reflectivity: 100, emissive: 0o0 });
const material2 = new THREE.MeshLambertMaterial({ color: 0xffd7d6, reflectivity: 100, emissive: 0o0 });
const material3 = new THREE.MeshLambertMaterial({ color: 0xffe2a6, reflectivity: 100, emissive: 0o0 });
const material4 = new THREE.MeshLambertMaterial({ color: 0xd5edf8, reflectivity: 100, emissive: 0o0 });

// East Side of Street
const cube = new THREE.Mesh(geometry, material);
cube.position.set(15, 2.5, 5);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube);

const cube3 = new THREE.Mesh(geometry, material2);
cube3.position.set(15, 2.5, 15);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube3);

const cube5 = new THREE.Mesh(geometry, material3);
cube5.position.set(15, 2.5, 25);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube5);

const cube7 = new THREE.Mesh(geometry, material4);
cube7.position.set(15, 2.5, 35);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube7);

const cube9 = new THREE.Mesh(geometry, material);
cube9.position.set(15, 2.5, 45);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube9);

const cube11 = new THREE.Mesh(geometry, material2);
cube11.position.set(15, 2.5, 55);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube11);

const cube13 = new THREE.Mesh(geometry, material3);
cube13.position.set(15, 2.5, 65);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube13);

const cube15 = new THREE.Mesh(geometry, material4);
cube15.position.set(15, 2.5, 75);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube15);

const cube17 = new THREE.Mesh(geometry, material);
cube17.position.set(15, 2.5, 85);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube17);


// West Side of Street
const cube2 = new THREE.Mesh(geometry, material);
cube2.position.set(-15, 2.5, 5);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube2);

const cube4 = new THREE.Mesh(geometry, material4);
cube4.position.set(-15, 2.5, 15);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube4);

const cube6 = new THREE.Mesh(geometry, material3);
cube6.position.set(-15, 2.5, 25);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube6);

const cube8 = new THREE.Mesh(geometry, material2);
cube8.position.set(-15, 2.5, 35);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube8);

const cube10 = new THREE.Mesh(geometry, material);
cube10.position.set(-15, 2.5, 45);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube10);

const cube12 = new THREE.Mesh(geometry, material4);
cube12.position.set(-15, 2.5, 65);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube12);

const cube14 = new THREE.Mesh(geometry, material);
cube14.position.set(-15, 2.5, 75);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube14);

const cube16 = new THREE.Mesh(geometry, material2);
cube16.position.set(-15, 2.5, 85);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube16);

const cube18 = new THREE.Mesh(geometry, material3);
cube18.position.set(-15, 2.5, 95);  // Adjust y to half of the height (5/2 = 2.5)
scene.add(cube18);


// Side Street North
const cuben1 = new THREE.Mesh(geometry, material4);
cuben1.position.set(-80, 2.5, 45); 
scene.add(cuben1);

const cuben2 = new THREE.Mesh(geometry, material);
cuben2.position.set(-70, 2.5, 45);  
scene.add(cuben2);

const cuben3 = new THREE.Mesh(geometry, material2);
cuben3.position.set(-60, 2.5, 45);
scene.add(cuben3);

const cuben4 = new THREE.Mesh(geometry, material3);
cuben4.position.set(-50, 2.5, 45);
scene.add(cuben4);

const cuben5 = new THREE.Mesh(geometry, material4);
cuben5.position.set(-40, 2.5, 45);
scene.add(cuben5);

const cuben6 = new THREE.Mesh(geometry, material);
cuben6.position.set(-30, 2.5, 45);
scene.add(cuben6);

const cuben7 = new THREE.Mesh(geometry, material2);
cuben7.position.set(-20, 2.5, 45);
scene.add(cuben7);


// Side Street South
const cubes1 = new THREE.Mesh(geometry, material2);
cubes1.position.set(-60, 2.5, 65);  
scene.add(cubes1);

const cubes2 = new THREE.Mesh(geometry, material3);
cubes2.position.set(-50, 2.5, 65);  
scene.add(cubes2);

const cubes3 = new THREE.Mesh(geometry, material4);
cubes3.position.set(-40, 2.5, 65); 
scene.add(cubes3);

const cubes4 = new THREE.Mesh(geometry, material);
cubes4.position.set(-30, 2.5, 65); 
scene.add(cubes4);

const cubes5 = new THREE.Mesh(geometry, material2);
cubes5.position.set(-20, 2.5, 65);
scene.add(cubes5);



// // Navigate with OrbitConrols
// const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.target.set(0, 0, 0);  // Set the point the camera should orbit around
// orbitControls.update();  // Update controls to apply changes

// function animate() {
//     requestAnimationFrame(animate);
//     orbitControls.update();  // Update the controls in each frame
//     renderer.render(scene, camera);
//   }
  
//   animate();


// Navigate with PointerLockControls
const pointerLockControls = new PointerLockControls(camera, renderer.domElement); // Pointer lock will only activate when you interact directly with the canvas
// const pointerLockControls = new PointerLockControls(camera, document.body); // Clicking anywhere on the webpage can activate the pointer lock

document.addEventListener('click', () => {
  pointerLockControls.lock();  // Locks the pointer to enable first-person control
});

// Handle Movement with Keyboard
const moveSpeed = 0.3;

// scene.add(pointerLockControls.getObject());  // Add the controls object to the scene

// Set keyboard controls to move around
const onKeyDown = function (event) {
    switch (event.code) {
      case 'KeyW':
        pointerLockControls.moveForward(moveSpeed);  // Move forward
        break;
      case 'KeyS':
        pointerLockControls.moveForward(-moveSpeed);  // Move backward
        break;
      case 'KeyA':
        pointerLockControls.moveRight(-moveSpeed);    // Move left
        break;
      case 'KeyD':
        pointerLockControls.moveRight(moveSpeed);  // Move right
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown, false);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

animate();

// // Navigate with FirstPersonCowwntrols
// const firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
// firstPersonControls.movementSpeed = 1;
// firstPersonControls.lookSpeed = 0.004;

// function animate() {
//     requestAnimationFrame(animate);
//     firstPersonControls.update(0.1);  // Update the controls in each frame
//     renderer.render(scene, camera);
// }

// animate();


// Finally - Render
renderer.render(scene, camera); 