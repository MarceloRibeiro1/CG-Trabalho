import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        createGroundPlane,
        createLightSphere,        
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information  var renderer = initRenderer();    // View function in util/utils
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(6.5, 6.0, 8.5);
  camera.up.set( 0, 1, 0 );

var ambientLight = new THREE.AmbientLight("rgb(255, 255, 255)");
scene.add(ambientLight);

/*var lightPosition = new THREE.Vector3(20.5, 15.8, 10.0);
  var light = new THREE.SpotLight(0xffffff);
  light.position.copy(lightPosition);
  light.castShadow = true;
  light.penumbra = 0.5;    
scene.add(light);*/

//var lightSphere = createLightSphere(scene, 0.1, 10, 10, lightPosition);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Cylinder
var cylinderGeometry = new THREE.CylinderGeometry(2.0, 2.0, 6.0,100,100,1);
var cylinderMaterial = new THREE.MeshLambertMaterial();
var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.castShadow = true;
  cylinder.position.set(0.0, 0.0, 0.0);
//scene.add(cylinder);

var circleGeometry = new THREE.CircleGeometry(2.0, 100.0, 100.0, 10.0);
var circleMaterial = new THREE.MeshLambertMaterial();
var circle = new THREE.Mesh(circleGeometry, circleMaterial);
  circle.castShadow = true;
  circle.position.set(0.0, 3.0, 0.0);
  circle.rotateX(degreesToRadians(-90));
//scene.add(circle);

var circleGeometry2 = new THREE.CircleGeometry(2.0, 100.0, 100.0, 10.0);
var circleMaterial2 = new THREE.MeshLambertMaterial();
var circle2 = new THREE.Mesh(circleGeometry2, circleMaterial2);
  circle2.castShadow = true;
  circle2.position.set(0.0, -3.0, 0.0);
  circle2.rotateX(degreesToRadians(90));
//scene.add(circle2);

// Cube
//var cubeSize = 0.6;
var cubeGeometry = new THREE.BoxGeometry(2.0, 0.0, 2.0);
var cubeMaterial = new THREE.MeshLambertMaterial();
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.position.set(0.0, 0.0, 0.0);
scene.add(cube);

var cubeGeometry2 = new THREE.BoxGeometry(2.0, 2.0, 0.0);
var cubeMaterial2 = new THREE.MeshLambertMaterial();
var cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
  cube2.castShadow = true;
  cube2.position.set(0.0, 1.0, 1.0);
scene.add(cube2);

var cubeGeometry3 = new THREE.BoxGeometry(2.0, 2.0, 0.0);
var cubeMaterial3 = new THREE.MeshLambertMaterial();
var cube3 = new THREE.Mesh(cubeGeometry3, cubeMaterial3);
  cube3.castShadow = true;
  cube3.position.set(0.0, 1.0, -1.0);
scene.add(cube3);

var cubeGeometry4 = new THREE.BoxGeometry(2.0, 2.0, 0.0);
var cubeMaterial4 = new THREE.MeshLambertMaterial();
var cube4 = new THREE.Mesh(cubeGeometry4, cubeMaterial4);
  cube4.castShadow = true;
  cube4.position.set(1.0, 1.0, 0.0);
  cube4.rotateY(degreesToRadians(90));
scene.add(cube4);

var cubeGeometry5 = new THREE.BoxGeometry(2.0, 2.0, 0.0);
var cubeMaterial5 = new THREE.MeshLambertMaterial();
var cube5 = new THREE.Mesh(cubeGeometry5, cubeMaterial5);
  cube5.castShadow = true;
  cube5.position.set(-1.0, 1.0, 0.0);
  cube5.rotateY(degreesToRadians(90));
scene.add(cube5);

var cubeGeometry6 = new THREE.BoxGeometry(2.0, 0.0, 2.0);
var cubeMaterial6 = new THREE.MeshLambertMaterial();
var cube6 = new THREE.Mesh(cubeGeometry6, cubeMaterial6);
  cube6.castShadow = true;
  cube6.position.set(0.0, 2.0, 0.0);
scene.add(cube6);

// Torus
var torusScale = 1.0;
var torusGeometry = new THREE.TorusGeometry(2.0, .8, 200, 200, 200);
var torusMaterial = new THREE.MeshLambertMaterial();
var torusTire = new THREE.Mesh(torusGeometry, torusMaterial);
  torusTire.castShadow = true;
  torusTire.position.set(0.0, 0.0, 0.0);
  torusTire.scale.set( torusScale, torusScale, torusScale);
scene.add(torusTire);


//----------------------------------------------------------------------------
//-- Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var floor  = textureLoader.load('../assets/textures/wood.png');
var cover = textureLoader.load('../assets/textures/woodtop.png');

var crate  = textureLoader.load('../assets/textures/crate.jpg');

var pneu  = textureLoader.load('../works/pile_of_tires/textures/Pneu_0_diffuse.png');
var pneu  = textureLoader.load('../works/pile_of_tires/textures/Pneu_1_diffuse.png');

// Apply texture to the 'map' property of the plane
torusTire.material.map = pneu;

cube.material.map = crate;
cube2.material.map = crate;
cube3.material.map = crate;
cube4.material.map = crate;
cube5.material.map = crate;
cube6.material.map = crate;

var crateFull = new THREE.Mesh(cubeGeometry,cubeMaterial);
var scaleCrate = 1.0;
crateFull.add(cube);
crateFull.add(cube2);
crateFull.add(cube3);
crateFull.add(cube4);
crateFull.add(cube5);
crateFull.add(cube6);
crateFull.position.set(0.0, 0.0, 0.0);
crateFull.scale.set( scaleCrate, scaleCrate, scaleCrate);
//scene.add(crateFull);

//buildInterface();
render();

function render()
{
  stats.update();
  trackballControls.update();
  //rotateLight();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}

