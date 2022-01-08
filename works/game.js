import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import { Cybertruck } from       './cybertruck.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer,
        initDefaultBasicLight,
        createGroundPlaneWired,
      degreesToRadians} from "../libs/util/util.js";

import {LapInfo, Stopwatch, Speedway, gameInfo} from './enviroment.js';
import { Car} from './car.js';
    

var materialWheels = new THREE.MeshPhongMaterial( { color: "rgb(30, 30, 30)" } );	
var materialWheels2 = new THREE.MeshPhongMaterial( { color: "rgb(200, 200, 200)" } );	

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 40)");

//Stopwatch flags
var startStopwatchFlag = true; // Flag que inicia o cronômetro quando seta para cima é apertado no inicio do jogo
var firstLapFlag = true; //Flag para atualização da primeira volta
var secLapFlag = true; //Flag para atualização da segunda volta
var thirdLapFlag = true; //Flag para atualização da terceira volta
var fourthLapFlag = true; //Flag para atualização da quarta volta

var gameIsOnFlag = true; //Flag para mostrar as informações das voltas após o termino do jogo

var lapTimes = []; //Array que guarda o tempo de cada volta em string

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); //Camera principal
  camera.lookAt(0, 0, 0);
  camera.position.set(0,80,80);
  camera.up.set( 0, 1, 0);
var TrackballCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); //Trackball
  TrackballCamera.lookAt(0, 0, 0);
  TrackballCamera.position.set(30,5,50);
  TrackballCamera.up.set( 0, 1, 0 );

scene.add(camera);
scene.add(TrackballCamera);

var trackballControls = new TrackballControls( TrackballCamera, renderer.domElement );

var cameraFree = false; //Flack que ativa o modo de inspeção

window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
window.addEventListener( 'resize', function(){onWindowResize(TrackballCamera, renderer)}, false );
export function onWindowResize(camera, renderer){

  if (camera instanceof THREE.PerspectiveCamera)
  {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  else {
    // TODO for other cameras
  }
}

// To use the keyboard
var keyboard = new KeyboardState();

// Car
var cybertruck;
var objectToFollow;
var massVehicle = 1000;
var friction = 1000;
var suspensionStiffness = 20.0;
var suspensionDamping = 5.3;
var suspensionCompression = 0.3;
var suspensionRestLength = 0.1;
var rollInfluence = 0.2;
var steeringIncrement = .04;
var steeringClamp = .5;
var maxEngineForce = 3000;
var maxBreakingForce = 100;
var speed = 0;
var quat = new THREE.Quaternion();
var acceleration = false;
var braking = false;
var right = false;
var left = false;
var engineForce = 0;
var vehicleSteering = 0;
var breakingForce = 0;

// Physics variables
var collisionConfiguration;
var dispatcher;
var broadphase;
var solver;
var physicsWorld;

var syncList = [];
var time = 0;
var clock = new THREE.Clock();

Ammo().then(function() { //Tudo que usa a física tem que estar dentro dessa função
	initPhysics();
	createObjects();	
	render();
});

function initPhysics() {
	// Physics configuration
	collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
	dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
	broadphase = new Ammo.btDbvtBroadphase();
	solver = new Ammo.btSequentialImpulseConstraintSolver();
	physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
	physicsWorld.setGravity( new Ammo.btVector3( 0, -12.82, 0 ) );
}


var TRANSFORM_AUX = null;
var ZERO_QUATERNION = new THREE.Quaternion(0, 0, 0, 1);
var materialGround = new THREE.MeshPhongMaterial({ color: "rgb(180, 180, 180)" });

function createWireFrame(mesh)
{	
	// wireframe
	var geo = new THREE.EdgesGeometry( mesh.geometry ); // or WireframeGeometry
	var mat = new THREE.LineBasicMaterial( { color: "rgb(80, 80, 80)", linewidth: 1.5} );
	var wireframe = new THREE.LineSegments( geo, mat );
	mesh.add( wireframe );
}

function createObjects() {
  // Aqui seria a speedway com colisão
  var speedway = new Speedway(21, 1);
  speedway.blocks.forEach(function(block) {
    physicsWorld.addRigidBody( block.body );
    scene.add(block.block); //Adiciona na cena cada cube do array de blocos 
    scene.add(block.fundo); //Adiciona na cena o fundo de cada cube do array de blocos 
  })
  speedway.muroDentro.forEach(function(block) {
    physicsWorld.addRigidBody( block.body );
    scene.add(block.block); //Adiciona na cena cada cube do array de blocos 
  })
  speedway.muroFora.forEach(function(block) {
    physicsWorld.addRigidBody( block.body );
    scene.add(block.block); //Adiciona na cena cada cube do array de blocos 
  })
  
  var ground = createBox(new THREE.Vector3(0, -2, 0), ZERO_QUATERNION, 800, 1, 800, 0, 2, materialGround, true);
  setGroundTexture(ground);
  ground.visible = true
  

  // Ramps
	var quaternion = new THREE.Quaternion(0, 0, 0, 1);
	var ramp;
	// quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), degreesToRadians(-15));
	// ramp = createBox(new THREE.Vector3(0, -8.5, 0), quaternion, 20, 4, 10, 0, 0, materialWheels);
	// createWireFrame(ramp);
	quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), degreesToRadians(-20));	
	ramp = createBox(new THREE.Vector3(0, -5.0, 100), quaternion, 20, 10, 50, 0, 0, materialWheels);	
	createWireFrame(ramp);	
	// quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), degreesToRadians(-5));	
	// ramp = createBox(new THREE.Vector3(-0, -8.5, 0), quaternion, 8, 4, 15, 0, 0, materialWheels);	
	// createWireFrame(ramp);	

  var textureLoader = new THREE.TextureLoader();
  let licensePlate = textureLoader.load("https://i.ibb.co/R9tkkV0/license-plate.png")
  cybertruck = new Cybertruck(licensePlate);
  scene.add(cybertruck.mesh);
  scene.add(cybertruck.wheelsH[0]);
  scene.add(cybertruck.wheelsH[1]);
  scene.add(cybertruck.wheelsH[2]);
  scene.add(cybertruck.wheelsH[3]);
  console.log(cybertruck.mesh.quaternion);
  cybertruck.mesh.quaternion.copy(quat)
  objectToFollow = cybertruck.mesh;
  addPhysicsCar();
}

function setGroundTexture(mesh)
{
	var textureLoader = new THREE.TextureLoader();
	textureLoader.load( "../assets/textures/grid.png", function ( texture ) {
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 60, 60 );
		mesh.material.map = texture;
		mesh.material.needsUpdate = true;
	} );
}

function createBox(pos, quat, w, l, h, mass = 0, friction = 1, material, receiveShadow = false) {
	if(!TRANSFORM_AUX)
		TRANSFORM_AUX = new Ammo.btTransform();
	var shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
	var geometry = new Ammo.btBoxShape(new Ammo.btVector3(w * 0.5, l * 0.5, h * 0.5));

	var mesh = new THREE.Mesh(shape, material);
		mesh.castShadow = true;
		mesh.receiveShadow = receiveShadow;
	mesh.position.copy(pos);
	mesh.quaternion.copy(quat);
	scene.add( mesh );

	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
	transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
	var motionState = new Ammo.btDefaultMotionState(transform);

	var localInertia = new Ammo.btVector3(0, 0, 0);
	geometry.calculateLocalInertia(mass, localInertia);

	var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia);
	var body = new Ammo.btRigidBody(rbInfo);
	body.setFriction(friction);

	physicsWorld.addRigidBody( body );

	if (mass > 0) {
		// Sync physics and graphics
		function sync(dt) {
			var ms = body.getMotionState();
			if (ms) {
				ms.getWorldTransform(TRANSFORM_AUX);
				var p = TRANSFORM_AUX.getOrigin();
				var q = TRANSFORM_AUX.getRotation();
				mesh.position.set(p.x(), p.y(), p.z());
				mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
			}
		}
		syncList.push(sync);
	}
	return mesh;
}

function addPhysicsCar(){
  // ------------------- AMMO PHYSICS
  // Chassis
  var transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(0, 2, 420));
  transform.setRotation(new Ammo.btQuaternion(0,-1,0,1));
  var motionState = new Ammo.btDefaultMotionState(transform);
  var localInertia = new Ammo.btVector3(0, 0, 0);
  var carChassi = new Ammo.btBoxShape(new Ammo.btVector3(cybertruck.width * .5, cybertruck.height * .2, cybertruck.depth * .5));
  carChassi.calculateLocalInertia(massVehicle, localInertia);
  var bodyCar = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, carChassi, localInertia));
  physicsWorld.addRigidBody(bodyCar);
  

  // Raycast Vehicle
  var tuning = new Ammo.btVehicleTuning();
  var rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
  var vehicle = new Ammo.btRaycastVehicle(tuning, bodyCar, rayCaster);
  vehicle.setCoordinateSystem(0, 1, 2);
  physicsWorld.addAction(vehicle);


  var wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
  var wheelAxleCS = new Ammo.btVector3(-1, 0, 0);

  function addWheel(isFront, pos, radius,wheelAxleCS) {

      var wheelInfo = vehicle.addWheel(
              pos,
              wheelDirectionCS0,
              wheelAxleCS,
              suspensionRestLength,
              radius,
              tuning,
              isFront);

      wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
      wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
      wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
      wheelInfo.set_m_frictionSlip(friction);
      wheelInfo.set_m_rollInfluence(rollInfluence);

  }

  addWheel(true, new Ammo.btVector3(cybertruck.width*0.58,cybertruck.height*-0.16,cybertruck.depth*0.36), cybertruck.height * 0.23,wheelAxleCS);
  addWheel(true, new Ammo.btVector3(cybertruck.width*-0.58,cybertruck.height*-0.16,cybertruck.depth*0.36), cybertruck.height * 0.23,wheelAxleCS);
  addWheel(false, new Ammo.btVector3(cybertruck.width*0.58,cybertruck.height*-0.16,cybertruck.depth*-0.3), cybertruck.height * 0.23,wheelAxleCS);
  addWheel(false, new Ammo.btVector3(cybertruck.width*-0.58,cybertruck.height*-0.16,cybertruck.depth*-0.3), cybertruck.height * 0.23,wheelAxleCS);

  var speedometer;
  speedometer = document.getElementById( 'speedometer' );

  //cybertruck.mesh.position.set(0,10,0)

  function sync(dt) {
      if (!cameraFree) speed = vehicle.getCurrentSpeedKmHour();
      else speed = cybertruck.speed;
      speedometer.innerHTML = (speed < 0 ? '(R) ' : '') + Math.abs(speed).toFixed(1) + ' km/h';
      breakingForce = 0;
      engineForce = 0;

      //vehicleSteering += 0.05
      applyForce();

      if (cameraFree) stopMovement(vehicle);
      else
        {
        vehicle.applyEngineForce(engineForce, 2);
        vehicle.applyEngineForce(engineForce, 3);
      
        vehicle.setBrake(breakingForce, 2);
        vehicle.setBrake(breakingForce, 3);
      
        vehicle.setSteeringValue(vehicleSteering, 0);
        vehicle.setSteeringValue(vehicleSteering, 1);
      
        var tm, p, q, i;
        var n = vehicle.getNumWheels();
        for (i = 0; i < n; i++) {
            vehicle.updateWheelTransform(i, true);
            tm = vehicle.getWheelTransformWS(i);
            p = tm.getOrigin();
            q = tm.getRotation();
            cybertruck.wheelsH[i].position.set(p.x(), p.y(), p.z());
            cybertruck.wheelsH[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
        }   
        tm = vehicle.getChassisWorldTransform();
        p = tm.getOrigin();
        q = tm.getRotation();
        cybertruck.mesh.position.set(p.x(), p.y(), p.z());
        cybertruck.mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }

        //console.log(engineForce)
  }
  syncList.push(sync);
}

function stopMovement (vehicle){

    if (acceleration) {
      if (cybertruck.speed < 80)
      cybertruck.speed++;
    }
    if (braking) {
      if (cybertruck.speed > -80)
      cybertruck.speed--;
    }
    if (left) {
      if (vehicleSteering < steeringClamp)
        vehicleSteering += steeringIncrement;
    }
    else {
      if (right) {
        if (vehicleSteering > -steeringClamp)
          vehicleSteering -= steeringIncrement;
      }
      else {
        if (vehicleSteering < -steeringIncrement)
          vehicleSteering += steeringIncrement;
        else {
          if (vehicleSteering > steeringIncrement)
            vehicleSteering -= steeringIncrement;
          else {
            vehicleSteering = 0;
          }
        }
      }
    }
    if (!acceleration && !braking){
      if (cybertruck.speed > 5)
        cybertruck.speed--;
      else {
        if (cybertruck.speed < -5)  cybertruck.speed++;
        else cybertruck.speed = 0
      }
    }

    vehicle.setSteeringValue(vehicleSteering, 0);
    vehicle.setSteeringValue(vehicleSteering, 1);
  
    var tm, p, q, i;
    for (i = 0; i < 2; i++) {
        vehicle.updateWheelTransform(i, true);
        tm = vehicle.getWheelTransformWS(i);
        p = tm.getOrigin();
        q = tm.getRotation();
        //cybertruck.wheelsH[i].position.set(p.x(), p.y(), p.z());
        cybertruck.wheelsH[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
    }  
  
    var tireRadius = cybertruck.height * 0.23,
    feetPerMin = (cybertruck.speed * 1000) / 60,
    rpm = feetPerMin / (2 * Math.PI * (tireRadius / 12)),
    incRotate = (Math.PI * 2) * (rpm / 6e4) * (1e3 / 60);

 
    cybertruck.wheels.forEach(e => {
      e.rotation.x -= incRotate / 10;
  
      if (e.rotation.x >= Math.PI * 2)
        e.rotation.x = 0;
  
    });
    // cybertruck.wheelsH[0].rotation.z = vehicleSteering + Math.PI;
    // cybertruck.wheelsH[1].rotation.z = vehicleSteering + Math.PI;
}



// Show axes (parameter is size of each axis)
//var axesHelper = new THREE.AxesHelper( 12 );
//scene.add( axesHelper );

//Light
initDefaultBasicLight(scene, true);
/*
//Create the ground plane
var plane = createGroundPlaneWired(600, 600, 50, 50); // width and height
scene.add(plane);

//Create Speedway
var speedway = new Speedway(21, 1);
speedway.blocks.forEach(function(block) {
  scene.add(block.block); //Adiciona na cena cada cube do array de blocos 
  scene.add(block.fundo); //Adiciona na cena o fundo de cada cube do array de blocos 
})

//Create car
var car = new Car(1)
scene.add(car.group);
//car.placeInitialPosition(speedway.sideSize);
car.group.scale.set(0.3, 0.3, 0.3);
//car.updateNumCorners(speedway);
*/

cybertruck.updateNumCorners(speedway);
camera.position.set(car.group.position.x +60 ,car.group.position.y + 60,60);

//Create Stopwatches
var stopwatch = new Stopwatch();
var swLaps = new Stopwatch();


//Move
function applyForce(){
  if (acceleration) {
    if (speed < -1)
      breakingForce = maxBreakingForce;
    else engineForce = maxEngineForce;
  }
  if (braking) {
    if (speed > 1)
      breakingForce = maxBreakingForce;
    else engineForce = -maxEngineForce / 2;
  }
  if (left) {
    if (vehicleSteering < steeringClamp)
      vehicleSteering += steeringIncrement;
  }
  else {
    if (right) {
      if (vehicleSteering > -steeringClamp)
        vehicleSteering -= steeringIncrement;
    }
    else {
      if (vehicleSteering < -steeringIncrement)
        vehicleSteering += steeringIncrement;
      else {
        if (vehicleSteering > steeringIncrement)
          vehicleSteering -= steeringIncrement;
        else {
          vehicleSteering = 0;
        }
      }
    }
  }
  if (!acceleration && !braking){
    if (speed > 1)
      breakingForce = maxBreakingForce/4;
    else engineForce = maxEngineForce / 4;
  }
}

function keyboardUpdate2() {

  keyboard.update();
  if ( keyboard.pressed("up")) acceleration = true;
  else acceleration = false;
  if ( keyboard.pressed("down")) braking = true;
  else braking = false;
  if ( keyboard.pressed("left")) left = true;
  else left = false;
  if ( keyboard.pressed("right")) right = true;
  else right = false
  
}


function keyboardUpdate() {

  keyboard.update();

  var direction = 0;

  if ( keyboard.pressed("up")){
    direction = 1;
    car.accelerate(direction, speedway);

    if(startStopwatchFlag){
      stopwatch.start();
      swLaps.start();
      startStopwatchFlag = false;
    }
  }
  if ( keyboard.pressed("down") )
  {
    direction = -1;
    car.accelerate(direction, speedway);
  }

  var angle = degreesToRadians(3);
  if ( keyboard.pressed(",") )  car.group.rotateY(  angle );
  if ( keyboard.pressed(".") ) car.group.rotateY( -angle );

  if ( keyboard.pressed("left") ){
    //car.goLeft(direction*angle);
    car.goLeft(angle);
  }else{
    car.stop();
  }
  if ( keyboard.pressed("right") ){
   //car.goRight(direction*angle);
   car.goRight(angle);
  }


  if(direction == 0)  car.slowdown();
  car.group.translateZ(car.velocity);

  //Mudar as pistas: 
  if(keyboard.pressed("1")){
    
    speedway.blocks.forEach(function(block){
      block.cube.visible = false;
      block.cubeFundo.visible = false;
    })
    speedway = new Speedway(21, 1);
    speedway.blocks.forEach(function(block) {
      scene.add(block.block); //Adiciona na cena cada cube do array de blocos 
      scene.add(block.fundo); //Adiciona na cena o fundo de cada cube do array de blocos 
    })
    car.group.visible = false;
    car = new Car(1)
    scene.add(car.group);
    car.placeInitialPosition(speedway.sideSize);
    car.group.scale.set(0.3, 0.3, 0.3);
    car.updateNumCorners(speedway);
    stopwatch = new Stopwatch();
    swLaps = new Stopwatch();
    startStopwatchFlag = true;

    lapTimes = [];
    firstLapFlag = secLapFlag = thirdLapFlag = fourthLapFlag = true;
    stopwatchInfo.changeBestLap("Best Lap: 00:00")
    
  }

  if(keyboard.pressed("2")){
    
    speedway.blocks.forEach(function(block){
      block.cube.visible = false;
      block.cubeFundo.visible = false;
    })
    speedway = new Speedway(21, 2);
    speedway.blocks.forEach(function(block) {
      scene.add(block.block); //Adiciona na cena cada cube do array de blocos 
      scene.add(block.fundo); //Adiciona na cena o fundo de cada cube do array de blocos 
    })
    car.group.visible = false;
    car = new Car(1)
    scene.add(car.group);
    car.placeInitialPosition(speedway.sideSize);
    car.group.scale.set(0.3, 0.3, 0.3);
    car.updateNumCorners(speedway);
    stopwatch = new Stopwatch();
    swLaps = new Stopwatch();
    startStopwatchFlag = true;

    lapTimes = [];
    firstLapFlag = secLapFlag = thirdLapFlag = fourthLapFlag = true;
    stopwatchInfo.changeBestLap("Best Lap: 00:00")
  }



}

//Camera

function cameraControl()
{
  changeCamera();
  
  if (cameraFree)
    trackballControls.update();
  else
    cameraFollow();
}

function changeCamera()
{
  if ( keyboard.down("space") )
  {
    // Troca de camera
    cameraFree = !cameraFree;
    setupCamera();
  }
}

function setupCamera()
{
  
  if (!cameraFree)
    {
      // Quando desativado o trackball
      // Ativar outros objetos a serem visíveis
      // speedway.blocks.forEach(function(block){
      //   block.cube.visible = true;
      //   block.cubeFundo.visible = true;
      // })
      // plane.visible = true;

    }
    else 
    {
      // Quando ativado o trackball
      // Arrumar Posicao
      trackballControls.reset;
      trackballControls.target.set( objectToFollow.position.x, objectToFollow.position.y, objectToFollow.position.z );
      TrackballCamera.up.set( 0,1,0 );
      TrackballCamera.position.set(objectToFollow.position.x + 80, 80, objectToFollow.position.z + 80);
      TrackballCamera.lookAt(objectToFollow.position);
      
      // Desativar visibilidade de outros objetos
      // speedway.blocks.forEach(function(block){
      //   block.cube.visible = false;
      //   block.cubeFundo.visible = false;
      // })

      //plane.visible = false;

      // var pos = new THREE.Vector3,
      //     quat = new THREE.Vector4,
      //     i; 
      // for (i = 0; i < 2; i++) {
      //   //cybertruck.wheelsH[i].position.copy(pos);
      //   cybertruck.wheelsH[i].quaternion.copy(quat);
      //     //cybertruck.wheelsH[i].position.set(pos);
      //     cybertruck.wheelsH[i].quaternion.set(quat);
      // } 
    
    }
}
//var objectToFollow = cybertruck.mesh;
function cameraFollow()
{
  
  var dir = new THREE.Vector3();
  objectToFollow.getWorldDirection(dir);
  camera.position.set(objectToFollow.position.x + dir.x*3 + 50, 50, objectToFollow.position.z + 50 + dir.z*3);
  camera.lookAt(objectToFollow.position.x + dir.x*3, 0, objectToFollow.position.z +dir.z*3);
}

function cameraRenderer ()
{
  if (cameraFree)
    renderer.render(scene, TrackballCamera);
  else
    renderer.render(scene, camera);
}


//Laps Info
var stopwatchInfo = new LapInfo();
var bestM = 61;
var bestS = 61;

function updateLapInfo() {
  stopwatchInfo.changeStopwatch(stopwatch.format);
  stopwatchInfo.changeLap("Lap: " + car.lap + "/4");
  stopwatchInfo.changeActualLap(swLaps.format);
  
  if((car.lap == 1) && firstLapFlag){
    //stopwatchInfo.add("Lap 1: " + swLaps.format);
    lapTimes.push(swLaps.format);
    updateBestLap(swLaps.mm, swLaps.ss);
    swLaps.clear();
    firstLapFlag = false;
  }else {
    if((car.lap == 2) && secLapFlag){
      //stopwatchInfo.add("Lap 2: " + swLaps.format);
      lapTimes.push(swLaps.format);
      updateBestLap(swLaps.mm, swLaps.ss);
      swLaps.clear();
      secLapFlag = false;
    }else{
      if((car.lap == 3) && thirdLapFlag){
        //stopwatchInfo.add("Lap 3: " + swLaps.format);
        lapTimes.push(swLaps.format);
        updateBestLap(swLaps.mm, swLaps.ss);
        swLaps.clear();
        thirdLapFlag = false;
      }else{
        if((car.lap == 4) && fourthLapFlag){
          //stopwatchInfo.add("Lap 4: " + swLaps.format);
          lapTimes.push(swLaps.format);
          updateBestLap(swLaps.mm, swLaps.ss);
          //swLaps.clear();
          swLaps.stop();
          fourthLapFlag = false;
        }
      }
    }
  }
}

function updateBestLap(M, S){
  if(M < bestM){
    stopwatchInfo.changeBestLap("Best Lap: " + (M < 10 ? '0'+ M : M) + ":" + (S < 10 ? '0'+ S : S));
    bestM = M;
    bestS = S;
  }else{
    if(M == bestM && S < bestS){
      stopwatchInfo.changeBestLap("Best Lap: " + (M < 10 ? '0'+ M : M) + ":" + (S < 10 ? '0'+ S : S))
      bestM = M;
      bestS = S;
    }
  }
}


function isGameOver(){
  if(car.lap == 4){
    if(gameIsOnFlag)  gameOverInf();
    gameIsOnFlag = false;

  }
}

var gameOverInfo = new gameInfo();
function gameOverInf(){
  gameOverInfo.add("Total time : " + stopwatch.format);
  stopwatch.stop();
  for(var i=0; i < lapTimes.length; i++){
    gameOverInfo.add((i+1) + "º lap: " + lapTimes[i]);
  }
  gameOverInfo.show();
}

//render();
function render()
{
  // Physics
  var dt = clock.getDelta();
  for (var i = 0; i < syncList.length; i++)
    syncList[i](dt);
  time += dt;
  physicsWorld.stepSimulation( dt, 10 );


  stats.update(); // Update FPS
  keyboardUpdate2();
  //if(gameIsOnFlag){
    //keyboardUpdate();
    //car.movement(speedway);
  //}
  //updateLapInfo();
  //isGameOver();
  cameraControl();
  requestAnimationFrame(render);
  cameraRenderer(); // Render scene 
}
