// THREE.JS TOWN

// IMPORTS
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

// CREATE SCENE
const scene = new THREE.Scene();

// SET UP CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 20);  
camera.lookAt(0, 0, 0); 

// CREATE RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true; // ENABLE SHADOWMAP
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: for softer shadows

// CREATE LIGHTS
// AMBIENT
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
scene.add(ambientLight);

// HEMISPHERE
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
scene.add( hemiLight );

const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
// scene.add( hemiLightHelper );

// DIRECTIONAL
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.color.setHSL( 0.1, 1, 0.95 );
directionalLight.position.multiplyScalar( 30 );
directionalLight.position.set(50, 70, 70);
directionalLight.target.position.set(0, 0, 0)
directionalLight.castShadow = true; // Cast shadow

directionalLight.shadow.mapSize.width = 4096;  // Default is 512
directionalLight.shadow.mapSize.height = 4096; // Default is 512
directionalLight.shadow.camera.far = 800;   // Default is 500

directionalLight.shadow.camera.left = -100; // Ensure this encompasses the scene
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;  
scene.add(directionalLight);
scene.add(directionalLight.target);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(lightHelper);

// const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(shadowHelper);

let useDaylightSimulation = false;

// Toggle between Static and Daylight Simulation
function toggleLightMode(mode) {
    if (mode === 'daylight') {
        useDaylightSimulation = true;
        animateDaylight();
    } else {
        useDaylightSimulation = false;
        setStaticLight();
    }
}

// SET STATIC LIGHT MODE
function setStaticLight() {
    directionalLight.color.setHSL( 0.1, 1, 0.95 );
    directionalLight.position.multiplyScalar( 30 );
    directionalLight.position.set(50, 70, 70);
    directionalLight.target.position.set(0, 0, 0)
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 4096;  // Default is 512
    directionalLight.shadow.mapSize.height = 4096; // Default is 512
    directionalLight.shadow.camera.far = 800;   // Default is 500

    directionalLight.shadow.camera.left = -100; // Ensure this encompasses the scene
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    directionalLight.intensity = 0.6;
    ambientLight.intensity = 1;
    hemiLight.intensity = 1;
}

// DAYLIGHT ANIMATION 

// VARIABLES
let dayTime = 0; // Time of day (0 to 1)
const minSunAngle = Math.PI / 8; // Minimum angle (e.g., 22.5 degrees)
const maxSunAngle = Math.PI - minSunAngle; // Maximum angle (e.g., 157.5 degrees)

// FUNCTION: DAYLIGHT ANIMATION
function animateDaylight() {
    if (useDaylightSimulation) {

        dayTime += 0.001; // Increment time
        if (dayTime > 1) dayTime = 0; // Loop back

        // Update directional light position
        const angle = minSunAngle + dayTime * (maxSunAngle - minSunAngle); // Restrict to a portion of the circle
        const radius = 500; // Distance from the origin

        directionalLight.position.set(
            Math.sin(angle) * radius, // X
            Math.cos(angle) * 600,    // Y (adjusted to keep the sun high)
            Math.cos(angle) * radius  // Z
        );

        // Update light intensity to simulate changing daylight
        directionalLight.intensity = 1 + Math.sin(angle) * 0.5;

        // Update ambient light intensity
        ambientLight.intensity = 0.2 + 0.8 * Math.max(Math.sin(angle), 0); // Adjusting ambient light
        hemiLight.intensity = 0.2 + 0.8 * Math.max(Math.sin(angle), 0); // Adjusting hemiLight light

        // Optional: Update light color based on time of day
        directionalLight.color.setHSL(dayTime, 1, 0.7); // Color changes throughout the day
    }

    requestAnimationFrame(animateDaylight);
}

// BACKGROUND
scene.background = new THREE.Color(0x99ffff);
// scene.fog = new THREE.Fog( scene.background, 1, 2000 );

// SKYDOME
const vertexShader = document.getElementById( 'vertexShader' ).textContent;
const fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
const uniforms = {
    'topColor': { value: new THREE.Color( 0x0077ff ) },
    'bottomColor': { value: new THREE.Color( 0xffffff ) },
    'offset': { value: 33 },
    'exponent': { value: 0.6 }
};
uniforms[ 'topColor' ].value.copy( hemiLight.color );

// scene.fog.color.copy( uniforms[ 'bottomColor' ].value );

const skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
const skyMat = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide
} );

const sky = new THREE.Mesh( skyGeo, skyMat );
scene.add( sky );

// ORBITCONTROLS FOR NAVIGATION
const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.target.set(0, 0, 0);  // Set the point the camera should orbit around


// FIRSTPERSONCONTROLS FOR NAVIGATION
const firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
firstPersonControls.movementSpeed = 1;
firstPersonControls.lookSpeed = 0.004;
firstPersonControls.enabled = false; // Disable by default

let useOrbitControls = true;

// TOGGLE CONTROLS
function toggleControlsMode(mode) {
    if (mode === 'orbit') {
        orbitControls.enabled = true;
        firstPersonControls.enabled = false;
    } else {
        orbitControls.enabled = false;
        firstPersonControls.enabled = true;
    }
}


// EVENT LISTENERS FOR UI BUTTONS
document.getElementById('staticLight').addEventListener('click', () => {
toggleLightMode('static');
});

document.getElementById('daylightSim').addEventListener('click', () => {
    toggleLightMode('daylight');
});

document.getElementById('orbitControls').addEventListener('click', () => {
    toggleControlsMode('orbit');
});

document.getElementById('fpControls').addEventListener('click', () => {
    toggleControlsMode('fp');
});

// INITIAL SETTINGS
setStaticLight();
toggleControlsMode('orbit');

// CREATE COMPASS
// Grid helper
// var grid = new THREE.GridHelper(10, 10, "aqua", "gray");
// scene.add(grid);

var sph = new THREE.Spherical();
var dir = new THREE.Vector3();
var lastTheta = null;  // Track the last theta value
const EPSILON = 0.001; // Threshold to determine significant change

// Debugging statement to confirm initialization
console.log('sph initialized:', sph);
console.log('THREE.MathUtils available:', THREE.MathUtils);

// renderer.setAnimationLoop(() => {
//   renderer.render(scene, camera);
//   camera.getWorldDirection(dir);
//   sph.setFromVector3(dir);
//   compass.style.transform = `rotate(${THREE.Math.radToDeg(sph.theta) - 180}deg)`;
// });

// const textureLoader = new THREE.TextureLoader();
// const compassTexture = textureLoader.load('/assets/compass_rose.svg');

// const compassGeometry = new THREE.PlaneGeometry(6, 6); // Size of the compass plane
// const compassMaterial = new THREE.MeshBasicMaterial({ map: compassTexture, transparent: true, side: THREE.DoubleSide });
// const compassPlane = new THREE.Mesh(compassGeometry, compassMaterial);

// // Position the compass plane at the desired location
// compassPlane.position.set(-40, 20, 0); // Slightly above the ground to avoid z-fighting
// compassPlane.rotation.x = -Math.PI / 2; // Lay flat on the ground (rotate 90 degrees around the X-axis)
// compassPlane.rotation.z = Math.PI / 2; 
// compassPlane.rotation.y = Math.PI / 2; 

// scene.add(compassPlane);

// CREATE GROUND
const groundGeometry = new THREE.PlaneGeometry(2500, 2500);  // Large ground plane
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide }); // Green color
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;
// ground.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal
ground.rotation.x = Math.PI * -0.5;
ground.position.y = -1;  // Slightly lower the ground to avoid z-fighting with the cube
scene.add(ground);

// CREATE ROAD GEOMETRY
const roadGeometry = new THREE.PlaneGeometry(12, 2500); 
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); 

// CREATE WEST/EAST ROAD
const westRoad = new THREE.Mesh(roadGeometry, roadMaterial);
westRoad.rotation.x = -Math.PI / 2; 
westRoad.position.set(0, -0.9, 0);  // Set road to be central between the two rows of buildings
westRoad.receiveShadow = true;
scene.add(westRoad);

// CREATE NORTH/SOUTH ROAD
const northRoad = new THREE.Mesh(roadGeometry, roadMaterial);
northRoad.rotation.x = -Math.PI / 2; 
northRoad.rotation.z = Math.PI / 2;
northRoad.position.set(0, -0.9, 0);  // Set road to be central between the two rows of buildings
northRoad.receiveShadow = true;
scene.add(northRoad);


// HOUSE PARTS AND CREATE FUNCTION
(function (HouseMod) {
    // CREATE SIMPLE DOOR
    var SimpleDoor = function(materials) {
        materials = materials || materials_default;
        return new THREE.Mesh(new THREE.PlaneGeometry(1, 1.6), materials.door);
    };

    // CREATE FANCY DOOR
    var FancyDoor = function(materials) {
        materials = materials || materials_default;
        let doorBaseGeometry = new THREE.PlaneGeometry(1, 1.2);
        let doorBase = new THREE.Mesh(doorBaseGeometry, materials.door);
        doorBase.position.set(0, -0.2, 0); 
        let doorCurveGeometry = new THREE.CircleGeometry(0.5);
        let doorCurve = new THREE.Mesh(doorCurveGeometry, materials.door);
        doorCurve.position.set(0, 0.4, 0);
        let doorGroup = new THREE.Group();
        doorGroup.add(doorBase);
        doorGroup.add(doorCurve);
        return doorGroup;
    };

    // CREATE CIRCULAR WINDOW
    var WindowCircle = function(materials) {
        materials = materials || materials_default;
        return new THREE.Mesh(new THREE.CircleGeometry(0.5), materials.door);
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

    // CREATE HOUSE
    HouseMod.create = function({
        baseColor = 0xffffff,
        triColor = 0xffffff,
        roofColor = 0x202020,
        doorColor = 0xff0000,
        windowColor = 0x537d90,
        doorType = 'fancy', // 'fancy' or 'simple'
        windowType = 'rectangular', // 'rectangular' or 'triangular'
        scale = 1 // Scaling factor for the entire house
    } = {}) {
        const materials = {
            base: new THREE.MeshStandardMaterial({ color: baseColor, side: THREE.DoubleSide }),
            tri: new THREE.MeshStandardMaterial({ color: triColor, side: THREE.DoubleSide }),
            roof: new THREE.MeshStandardMaterial({ color: roofColor, side: THREE.DoubleSide }),
            door: new THREE.MeshStandardMaterial({ color: doorColor }),
            window: new THREE.MeshStandardMaterial({ color: windowColor })
        };

        // HOUSE GROUP
        var house = new THREE.Group();
        house.scale.set(scale, scale, scale); // Apply scale
        house.castShadow = true;
        house.receiveShadow = true;
        house.userData.type = 'house'; // set userData type


        // HOUSE BASE
        var base = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 4), materials.base);
        base.castShadow = true;
        base.receiveShadow = true;
        house.add(base);

        // HOUSE TRIANGLE/GABLE PARTS
        var tri1 = HouseTriangle(materials);
        tri1.castShadow = true;
        tri1.receiveShadow = true;
        tri1.position.set(-0.5, 1 , 2);
        house.add(tri1);

        var tri2 = HouseTriangle(materials);
        tri2.castShadow = true;
        tri2.receiveShadow = true;
        tri2.position.set(-0.5, 1 , -2);
        house.add(tri2);

        // ROOF
        var roof1 = new THREE.Mesh(new THREE.PlaneGeometry(2.84, 4.5), materials.roof);
        roof1.position.set(-1, 1.51, 0);
        roof1.rotation.set(Math.PI * 0.5, Math.PI * 0.25, 0);
        roof1.castShadow = true;
        roof1.receiveShadow = true;
        house.add(roof1);

        var roof2 = new THREE.Mesh(new THREE.PlaneGeometry(2.84, 4.5), materials.roof);
        roof2.position.set(1, 1.51, 0);
        roof2.rotation.set(Math.PI * 0.5, Math.PI * -0.25, 0);
        roof2.castShadow = true;
        roof2.receiveShadow = true;
        house.add(roof2);

        // DOOR
        let door;
        if (doorType === 'fancy') {
            door = FancyDoor(materials);
        } else {
            door = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.6), materials.door);
        }
        door.position.set(0.5, -0.2, 2.1);
        house.add(door);

        // WINDOWS
        let window1, window2, window3;
        if (windowType === 'rectangular') {
            window1 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materials.window);
            window1.position.set(-0.75, 0.1, 2.1);
            house.add(window1);

            window2 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materials.window);
            window2.position.set(-1.6, 0.1, -1.1);
            window2.rotation.set(Math.PI * 0.5, Math.PI * 1.5, 0);
            house.add(window2);

            window3 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materials.window);
            window3.position.set(-1.6, 0.1, 1.1);
            window3.rotation.set(Math.PI * 0.5, Math.PI * 1.5, 0);
            house.add(window3);
        } else if (windowType === 'circular') {
            let circleWindow1 = WindowCircle(materials);
            circleWindow1.position.set(-0.75, 0.5, 2.1);
            house.add(circleWindow1);
        }

        // HOUSE SHADOWS
        house.castShadow = true;
        house.receiveShadow = true;

        return house;
    };
}(window.HouseMod = window.HouseMod || {}));
    

// CENTRAL CUBE
var cube = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshPhongMaterial({ color: 0xfab74b}));
cube.position.set(0, 1.5 , 0);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// ARRAY FOR ALL HOUSE GROUP OBJECTS
var allHouses = [];

// GROUPS TO REPRESENT STREETS
let northStreetWest = new THREE.Group();
let northStreetEast = new THREE.Group();
let southStreetWest = new THREE.Group();
let southStreetEast = new THREE.Group();
let westStreetSouth = new THREE.Group();
let westStreetNorth = new THREE.Group();
let eastStreetNorth = new THREE.Group();
let eastStreetSouth = new THREE.Group();

northStreetWest.position.set(-30, 0, 8);
northStreetEast.position.set(-30, 0, -8);
southStreetWest.position.set(6, 0, 8);
southStreetEast.position.set(6, 0, -8);
westStreetSouth.position.set(0, 0, 0);
westStreetNorth.position.set(0, 0, 0);
eastStreetNorth.position.set(0, 0, 0);
eastStreetSouth.position.set(0, 0, 0);


// FUNCTION: CREATE RANDOM HOUSE
function createRandomHouse(relativeX, relativeZ, streetGroup, rotateY = 0, streetName) {
    const baseColors = [0xffff99, 0x6699ff, 0xffccff, 0x9999ff, 0x33ffcc]; 
    const doorColors = [0x3333ff, 0xffcc33];
    const roofColors = [0x537d90, 0xff9966, 0x666666];
    const doorType = ['simple', 'fancy']
    const windowType = ['rectangular', 'circular']
    const baseAndTriColor = baseColors[Math.floor(Math.random() * baseColors.length)];
    
    const house = HouseMod.create({
        baseColor: baseAndTriColor,
        triColor: baseAndTriColor,
        roofColor: roofColors[Math.floor(Math.random() * roofColors.length)],
        doorColor: doorColors[Math.floor(Math.random() * doorColors.length)],
        windowColor: 0x537d90,
        scale: Math.random() * 0.5 + 0.75,
        doorType: doorType[Math.floor(Math.random() * doorType.length)],
        windowType: windowType[Math.floor(Math.random() * windowType.length)],
    });
     // Calculate the global position
     let globalX = streetGroup.position.x + relativeX;
     let globalZ = streetGroup.position.z + relativeZ;
 
     house.position.set(globalX, 0, globalZ);
     house.rotation.y = rotateY;
 

    house.userData.address = `${streetName}`;
    
    console.log("House created with address:", house.userData.address);

    // Add the house to the specified street group
    streetGroup.add(house);
    allHouses.push(house);

    return house;
}


// CREATE HOUSES FOR STREETS
let addressCounter = 1;
for (let i = 0; i < 7; i++) {
    createRandomHouse(i * 8, 0, northStreetWest, Math.PI, `North Street ${addressCounter}`);
    addressCounter += 2;
}

for (let i = 0; i < 9; i++) {
    createRandomHouse(i * 6, 0, northStreetEast, 0, `North Street ${addressCounter}`);
    addressCounter += 2;
}

addressCounter = 1;
for (let i = 0; i < 9; i++) {
    createRandomHouse(i * 8, 0, southStreetWest, Math.PI, `South Street ${addressCounter}`);
    addressCounter += 2;
}

addressCounter = 2;
for (let i = 0; i < 10; i++) {
    createRandomHouse(i * 6, 0, southStreetEast, 0, `South Street ${addressCounter}`);
    addressCounter += 2;
}

addressCounter = 1;
for (let i = 0; i < 10; i++) {
    createRandomHouse(i * 8, 15, westStreetSouth, Math.PI, `West Street ${addressCounter}`);
    addressCounter += 2;
}
westStreetSouth.rotation.y = Math.PI / 2;
westStreetSouth.position.set(0, 0, 99);

addressCounter = 2;
for (let i = 0; i < 10; i++) {
    createRandomHouse(i * 8, 15, westStreetNorth, 0, `West Street ${addressCounter}`);
    addressCounter += 2;
}
westStreetNorth.rotation.y = Math.PI / 2;
westStreetNorth.position.set(-30, 0, 99);

addressCounter = 1;
for (let i = 0; i < 10; i++) {
    createRandomHouse(i * 8, -25, eastStreetNorth, Math.PI, `East Street ${addressCounter}`);
    addressCounter += 2;
}
eastStreetNorth.rotation.y = 3 * Math.PI / 2;
eastStreetNorth.position.set(-40, 0, -99);

addressCounter = 2;
for (let i = 0; i < 15; i++) {
    createRandomHouse(i * 5, 15, eastStreetSouth, 0, `East Street ${addressCounter}`);
    addressCounter += 2;
}
eastStreetSouth.rotation.y = 3 * Math.PI / 2;
eastStreetSouth.position.set(30, 0, -99);


// ADD STREET GROUPS TO SCENE
scene.add(northStreetWest);
scene.add(northStreetEast);
scene.add(southStreetWest);
scene.add(southStreetEast);
scene.add(westStreetSouth);
scene.add(westStreetNorth);
scene.add(eastStreetNorth);
scene.add(eastStreetSouth);


// CREATE RAYCASTER FOR DETECTING CLICKS
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ADD DOM ELEMENT TO DISPLAY ADDRESS
const addressCard = document.createElement('div');
addressCard.style.position = 'absolute';
addressCard.style.backgroundColor = 'white';
addressCard.style.padding = '10px';
addressCard.style.border = '1px solid black';
addressCard.style.borderRadius = '5px';
addressCard.style.display = 'none'; // Start hidden
document.body.appendChild(addressCard);

// UPDATE MOUSE VARIABLE ON MOUSE MOVE
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// HANDLE CLICKS
window.addEventListener('click', (event) => {
    // Update the raycaster based on the current mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the ray
    const intersects = raycaster.intersectObjects(allHouses);

    // console.log("Number of intersects:", intersects.length);
    // console.log(intersects);

    if(intersects.length > 0) {
        const object = intersects[0].object; // Take the first object only [0]

        // Traverse up to the parent group and check for the custom property
        let parent = object.parent;
        while (parent) {
            if (parent.userData.type === 'house') {
                // console.log('House group selected');
                // Perform actions on the house group
                
                let selectedHouse = parent
                let address = parent.userData.address

                // Display the address in the address card
                addressCard.innerHTML = `Address: ${address}`;
                addressCard.style.left = `${event.clientX}px`;
                addressCard.style.top = `${event.clientY}px`;
                addressCard.style.display = 'block';

                console.log("Address:", parent.userData.address);

                break;
            }
            parent = parent.parent;
        } 
    } else {
        // Hide the address card if no object was clicked
        addressCard.style.display = 'none';
    }

});

// WINDOW RESIZING
function onWindowResize() {
    // Update camera aspect ratio and renderer size
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Update compass size and position
    const compassContainer = document.getElementById('compassContainer');
    compassContainer.style.width = '10vw'; // Adjust as needed
    compassContainer.style.height = '10vw'; // Adjust as needed
}

// Add event listener for window resize
window.addEventListener('resize', onWindowResize, false);

// ANIMATE/RENDER
function animate() {
    requestAnimationFrame(animate);
    if (!useDaylightSimulation) setStaticLight(); // Ensure static light if not using daylight simulation

    orbitControls.update();
    firstPersonControls.update(0.1);

    // Update compass rotation
    // camera.getWorldDirection(dir);
    // sph.setFromVector3(dir);
    // compass.style.transform = `rotate(${THREE.MathUtils.radToDeg(sph.theta) - 180}deg)`;
    // Debugging statements

    // Update compass rotation only if there is a significant change
    if (camera && dir && sph) {
        camera.getWorldDirection(dir);
        sph.setFromVector3(dir);

        if (lastTheta === null || Math.abs(sph.theta - lastTheta) > EPSILON) {
            lastTheta = sph.theta;
            document.getElementById('compassContainer').style.transform = `rotate(${THREE.MathUtils.radToDeg(sph.theta) - 180}deg)`;
            console.log('Updated Compass:', THREE.MathUtils.radToDeg(sph.theta)); // Debug output
        }
    } else {
        console.error('Required variables are not defined.');
    }

    // Render the scene
    renderer.render(scene, camera);
}
animate();
