import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Build House with Gables

// Create the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 20);  
camera.lookAt(0, 0, 0); 

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10).normalize();
scene.add(directionalLight);


(function (HouseMod) {
    // Defining some default materials
    var materials_default = {
        base: new THREE.MeshStandardMaterial({
            color: 0xffffff, // White color for the base
            side: THREE.DoubleSide // Render both sides of the material
        }),
        tri: new THREE.MeshStandardMaterial({
            color: 0xffffff, // White for the triangular parts
            side: THREE.DoubleSide
        }),
        roof: new THREE.MeshStandardMaterial({
            color: 0x202020, // Dark grey for the roof
            side: THREE.DoubleSide
        }),
        door: new THREE.MeshStandardMaterial({
            color: 0xff0000, // // Red color for the door
        }),
        window: new THREE.MeshStandardMaterial({
            color: 0x537d90, // Dark grey for the windows
        })
    };

    // Creating a Triangle Part (HouseTriangle)
    // The HouseTriangle function creates a triangular mesh that represents the gable ends of the house
    var HouseTriangle = function(materials){
        materials = materials || materials_default;
        var geometry = new THREE.BufferGeometry(); // THREE.BufferGeometry is used to define a custom geometry
        var vertices = new Float32Array([ // vertices array defines three vertices of the triangle in 3D space
                -1, 0, 0, // Vertex 1
                0.5, 1.5, 0, // Vertex 2
                2, 0, 0 // Vertex 3
            ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // setAttribute method attaches these vertices to the geometry
        geometry.computeVertexNormals(); // compute vertex normals calculates normals for shading purposes
        geometry.addGroup(0, 3, 0); // just one group
        return new THREE.Mesh( // The geometry is combined with the materials.tri material to create a THREE.Mesh
            geometry, 
            materials.tri);
    };

    // Triangle Window
    var WindowTriangle = function(materials){
        materials = materials || materials_default;
        var geometry = new THREE.BufferGeometry(); // THREE.BufferGeometry is used to define a custom geometry
        var vertices = new Float32Array([ // vertices array defines three vertices of the triangle in 3D space
                -0.2, 0, 0, // Vertex 1
                0.5, 1, 0, // Vertex 2
                1.2, 0, 0 // Vertex 3
            ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // setAttribute method attaches these vertices to the geometry
        geometry.computeVertexNormals(); // compute vertex normals calculates normals for shading purposes
        geometry.addGroup(0, 3, 0); // just one group
        return new THREE.Mesh( // The geometry is combined with the materials.tri material to create a THREE.Mesh
            geometry, 
            materials.window);
    };

    // Fancy Door
    var FancyDoor = function(materials){
        materials = materials || materials_default;

        // Create the base rectangle of the door
        let doorBaseGeometry = new THREE.PlaneGeometry(1, 1); // Adjust size as needed
        let doorBase = new THREE.Mesh(doorBaseGeometry, materials.door);
        doorBase.position.set(0, 0, 0); 
    
        // Create a circular part for the door (e.g., a handle or window)
        let doorCurveGeometry = new THREE.CircleGeometry(0.5); // Adjust radius and segments
        let doorCurve = new THREE.Mesh(doorCurveGeometry, materials.door);
        doorCurve.position.set(0, 0.6, 0); 

        // Create a group to combine the geometries
    let doorGroup = new THREE.Group();
    doorGroup.add(doorBase);
    doorGroup.add(doorCurve);
    
    return doorGroup;
    };


    // Creating the House (HouseMod.create)
    // The HouseMod.create function assembles the house using the previously defined triangle function and some additional geometries
    HouseMod.create = function(materials){
        materials = materials || materials_default;
        var house = new THREE.Group(); // THREE.Group is used to group all the parts of the house together, making it easier to move or scale the entire house as a single entity.
        
        // Base of house (a simple box)
        var base = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 4), materials.base); // The base is a simple rectangular box (THREE.BoxGeometry) 
        house.add(base);

        // House triangle parts - Two triangle parts are created using HouseTriangle and added to the front and back of the house
        var tri1 = HouseTriangle(materials);
        tri1.position.set(-0.5, 1 , 2);
        house.add(tri1);

        var tri2 = HouseTriangle(materials);
        tri2.position.set(-0.5, 1 , -2);
        house.add(tri2);

        // Roof - The roof is made of two planes (THREE.PlaneGeometry) rotated and positioned to form a sloped roof on either side of the triangles
        var roof1 = new THREE.Mesh(
            new THREE.PlaneGeometry(2.84, 4.5), 
            materials.roof);
        roof1.position.set(-1, 1.51, 0);
        roof1.rotation.set(Math.PI * 0.5, Math.PI * 0.25, 0);
        house.add(roof1);

        var roof2 = new THREE.Mesh(
            new THREE.PlaneGeometry(2.84, 4.5), 
            materials.roof);
        roof2.position.set(1, 1.51, 0);
        roof2.rotation.set(Math.PI * 0.5, Math.PI * -0.25, 0);
        house.add(roof2);

        // To add door for home
        // let door1 = new THREE.Mesh(
        //     new THREE.PlaneGeometry(1, 1.6, 1), 
        //     materials.door);
        // door1.position.set(0.5, -0.2, 2.1);
        // house.add(door1);
        let fancyDoor = FancyDoor(materials_default);
        fancyDoor.position.set(0.5, -0.47, 2.1); // Adjust position as needed
        scene.add(fancyDoor);

        // Windows
        let window1 = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 1), 
            materials.window);
        window1.position.set(-0.75, 0.1, 2.1);
        house.add(window1);

        let window2 = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 1), 
            materials.window);
            window2.position.set(-1.6, 0.1, -1.1);
            window2.rotation.set(Math.PI * 0.5, Math.PI * 1.5, 0);
        house.add(window2);

        let window3 = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 1), 
            materials.window);
            window3.position.set(-1.6, 0.1, 1.1);
            window3.rotation.set(Math.PI * 0.5, Math.PI * 1.5, 0);
        house.add(window3);

        // CircleWindow
        let circleWindow1 = new THREE.Mesh(
            new THREE.CircleGeometry(0.3), 
            materials.window);
            circleWindow1.position.set(-0, 1.5, 2.1);
        house.add(circleWindow1);

        // Triangle Window
        var triWindow1 = WindowTriangle(materials);
        triWindow1.position.set(-0.5, 1, -2.2);
        materials.window.depthTest = true;
        materials.window.depthWrite = true;
        triWindow1.renderOrder = 1;
        house.add(triWindow1);

        // Shadows
        house.castShadow = true; // ensures the house can cast shadows in the scene, enhancing realism
        house.receiveShadow = false;
        
        return house;
    };
}(window.HouseMod = window.HouseMod || {}));

const house = HouseMod.create();
scene.add(house);

// To change background color of scene from black to blue
scene.background = new THREE.Color(0x030124);

// Navigate with OrbitConrols
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(0, 0, 0);  // Set the point the camera should orbit around

function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();  // Update the controls in each frame
    renderer.render(scene, camera);
}
animate();
