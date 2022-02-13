import * as THREE from  '../build/three.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {ARjs}    from  '../libs/AR/ar.js';
import {InfoBox,
        degreesToRadians,
        radiansToDegrees,
		initDefaultSpotlight} from "../libs/util/util.js";
import { Cybertruck } from       './cybertruck.js';
import KeyboardState from '../libs/util/KeyboardState.js';

var mixer = new Array();
var clock = new THREE.Clock();

// To use the keyboard
var keyboard = new KeyboardState();


var renderer	= new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setSize( 640, 480 );
	renderer.shadowMap.type = THREE.VSMShadowMap;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.enabled = true;


	
document.body.appendChild( renderer.domElement );
// init scene and camera
var scene	= new THREE.Scene();
var camera = new THREE.Camera();
scene.add(camera);



//var light = initDefaultSpotlight(scene, new THREE.Vector3(20, 20, 20)); // Use default light
 
var lightPosition = new THREE.Vector3(3.7, 2.2, 1.0);
var spotLight = new THREE.SpotLight("rgb(255,255,255)");
  spotLight.position.copy(lightPosition);
  spotLight.distance = 0;
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.5;
  spotLight.angle= degreesToRadians(40);
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.camera.fov = radiansToDegrees(spotLight.angle);
  spotLight.shadow.camera.near = .2;    
  spotLight.shadow.camera.far = 20.0;       

var light = new THREE.Object3D();
light.add(spotLight);
scene.add(light);


// array of functions for the rendering loop
var onRenderFcts= [];

// Show text information onscreen
showInformation();

//----------------------------------------------------------------------------
// Handle arToolkitSource
// More info: https://ar-js-org.github.io/AR.js-Docs/marker-based/
//var arToolkitSource = new THREEx.ArToolkitSource({
var arToolkitSource = new ARjs.Source({	
	// to read from the webcam
	//sourceType : 'webcam',

	// to read from an image
	//sourceType : 'image',
	//sourceUrl : '../assets/AR/kanjiScene.jpg',

	// to read from a video
	sourceType : 'video',
	sourceUrl : '../assets/AR/kanjiScene.mp4'
})

arToolkitSource.init(function onReady(){
	setTimeout(() => {
		onResize()
	}, 2000);
})

// handle resize
window.addEventListener('resize', function(){
	onResize()
})

function onResize(){
	arToolkitSource.onResizeElement()
	arToolkitSource.copyElementSizeTo(renderer.domElement)
	if( arToolkitContext.arController !== null ){
		arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
	}
}

//----------------------------------------------------------------------------
// initialize arToolkitContext
//
// create atToolkitContext
//var arToolkitContext = new THREEx.ArToolkitContext({
var arToolkitContext = new ARjs.Context({
	cameraParametersUrl: '../libs/AR/data/camera_para.dat',
	detectionMode: 'mono',
})

// initialize it
arToolkitContext.init(function onCompleted(){
	// copy projection matrix to camera
	camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
})

// update artoolkit on every frame
onRenderFcts.push(function(){
	if( arToolkitSource.ready === false )	return
	arToolkitContext.update( arToolkitSource.domElement )
	// update scene.visible if the marker is seen
	scene.visible = camera.visible
})

//----------------------------------------------------------------------------
// Create a ArMarkerControls
//
// init controls for camera
//var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
var markerControls = new ARjs.MarkerControls(arToolkitContext, camera, {	
	type : 'pattern',
	patternUrl : '../libs/AR/data/patt.kanji',
	changeMatrixMode: 'cameraTransformMatrix' // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
})
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

//----------------------------------------------------------------------------
// Adding object to the scene

/*
var cubeKnot = new THREE.Object3D();
createCubeKnot();
scene.add( cubeKnot );
*/

//Add cybertruck

var cyber = new THREE.Object3D();
var carResize = 0.1;
var textureLoader = new THREE.TextureLoader();
let licensePlate = 	textureLoader.load("https://i.ibb.co/R9tkkV0/license-plate.png")
let glass = textureLoader.load('./assets/glass.jpg')
let carbonFiber = textureLoader.load('./assets/carbonFiber.jpg')
let wheel = textureLoader.load('./assets/wheel.jpg')
var cybertruck = new Cybertruck(licensePlate,glass,carbonFiber,wheel);

var cmesh = cybertruck.mesh;

cmesh.add(cybertruck.wheelsH[0]);
cmesh.add(cybertruck.wheelsH[1]);
cmesh.add(cybertruck.wheelsH[2]);
cmesh.add(cybertruck.wheelsH[3]);
cybertruck.mesh.quaternion.copy(new THREE.Quaternion())
cybertruck.mesh.position.y = 0.2;
cmesh.scale.set(carResize,carResize,carResize);
cyber.add(cmesh);
scene.add(cyber);

var angle = 0;

function keyboardUpdate2() {

	keyboard.update();

	

	
	if ( keyboard.pressed("up")){
	cybertruck.wheelsH[0].rotateX(degreesToRadians(5));
	cybertruck.wheelsH[1].rotateX(degreesToRadians(5));
	cybertruck.wheelsH[2].rotateX(degreesToRadians(5));
	cybertruck.wheelsH[3].rotateX(degreesToRadians(5));
	}

	if ( keyboard.pressed("down")){
		cybertruck.wheelsH[0].rotateX(-degreesToRadians(5));
		cybertruck.wheelsH[1].rotateX(-degreesToRadians(5));
		cybertruck.wheelsH[2].rotateX(-degreesToRadians(5));
		cybertruck.wheelsH[3].rotateX(-degreesToRadians(5));
	}

	if ( keyboard.pressed("left")){

		if(angle < degreesToRadians(30)){
			cybertruck.wheelsH[0].rotateOnWorldAxis(new THREE.Vector3(0,1,0), -angle);
			cybertruck.wheelsH[1].rotateOnWorldAxis(new THREE.Vector3(0,1,0), -angle);
			angle += degreesToRadians(3);	
			cybertruck.wheelsH[0].rotateOnWorldAxis(new THREE.Vector3(0,1,0), angle);
			cybertruck.wheelsH[1].rotateOnWorldAxis(new THREE.Vector3(0,1,0), angle);
			}

	
}
	if ( keyboard.pressed("right")){
		if(angle > -degreesToRadians(30)){
		cybertruck.wheelsH[0].rotateOnWorldAxis(new THREE.Vector3(0,1,0), -angle);
		cybertruck.wheelsH[1].rotateOnWorldAxis(new THREE.Vector3(0,1,0), -angle);
		angle -= degreesToRadians(3);	
		cybertruck.wheelsH[0].rotateOnWorldAxis(new THREE.Vector3(0,1,0), angle);
		cybertruck.wheelsH[1].rotateOnWorldAxis(new THREE.Vector3(0,1,0), angle);
		}
		
	}
	
}



function createCubeKnot()
{
	var geometry	= new THREE.BoxGeometry(3,0.05,3);
	var material	= new THREE.MeshLambertMaterial({
		color: "rgb(255,255,255)",
		transparent : true,
		opacity: 0.3,
		side: THREE.DoubleSide
	});
	var mesh	= new THREE.Mesh( geometry, material );
    mesh.receiveShadow = true;
	mesh.position.y	= geometry.parameters.height/2
	cubeKnot.add( mesh );
}


// controls which object should be rendered
var firstObject = true;

var controls = new function ()
{
	this.onChangeObject = function(){
		firstObject = !firstObject;
		if(firstObject)
		{
			cubeKnot.visible = true;
			torus.visible = false;
		}
		else
		{
			cubeKnot.visible = false;
			torus.visible = true;
		}
	};
};

// GUI interface
//var gui = new dat.GUI();
var gui = new GUI();
gui.add(controls, 'onChangeObject').name("Change Object");

//----------------------------------------------------------------------------
// Render the whole thing on the page

// render the scene
onRenderFcts.push(function(){
	renderer.render( scene, camera );
    var delta = clock.getDelta(); // Get the seconds passed since the time 'oldTime' was set and sets 'oldTime' to the current time.
    for(var i = 0; i<mixer.length; i++)
        mixer[i].update( delta );

	spotLight.position.copy(camera.position);

	keyboardUpdate2();
})


function showInformation()
{
	// Use this to show information onscreen
	controls = new InfoBox();
		controls.add("Augmented Reality - Basic Example");
		controls.addParagraph();
		controls.add("Put the 'KANJI' marker in front of the camera.");
		controls.show();
}

// run the rendering loop
requestAnimationFrame(function animate(nowMsec)
{
	var lastTimeMsec= null;	
	// keep looping
	requestAnimationFrame( animate );
	// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec
	// call each update function
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(deltaMsec/1000, nowMsec/1000)
	})
})
