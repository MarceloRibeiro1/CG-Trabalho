import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer,
        initDefaultBasicLight,
        createGroundPlaneWired,
      degreesToRadians} from "../libs/util/util.js";

import {LapInfo, Stopwatch, Speedway, gameInfo} from './enviroment.js';
import { Car} from './car.js';
    

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 40)");

//Stopwatch flags
var startStopwatchFlag = true;
var firstLapFlag = true;
var secLapFlag = true;
var thirdLapFlag = true;
var fourthLapFlag = true;

var gameIsOnFlag = true;

var lapTimes = [];

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0,80,80);
  camera.up.set( 0, 1, 0);
var TrackballCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  TrackballCamera.lookAt(0, 0, 0);
  TrackballCamera.position.set(0,80,80);
  TrackballCamera.up.set( 0, 1, 0 );

scene.add(camera);
scene.add(TrackballCamera);

var trackballControls = new TrackballControls( TrackballCamera, renderer.domElement );

var cameraFree = false;

window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
window.addEventListener( 'resize', function(){onWindowResize(TrackballCamera, renderer)}, false );

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
//var axesHelper = new THREE.AxesHelper( 12 );
//scene.add( axesHelper );

//Light
initDefaultBasicLight(scene, true);

//Create the ground plane
var plane = createGroundPlaneWired(600, 600, 50, 50); // width and height
scene.add(plane);

//Create Speedway
var speedway = new Speedway(21, 2);
speedway.blocks.forEach(function(block) {
  scene.add(block.block); //Adiciona na cena cada cube do array de blocos 
  scene.add(block.fundo); //Adiciona na cena o fundo de cada cube do array de blocos 
})

//Create car
var car = new Car(1)
scene.add(car.group);
car.placeInitialPosition(speedway.sideSize);
car.group.scale.set(0.3, 0.3, 0.3);
car.updateNumCorners(speedway);

camera.position.set(car.group.position.x +60 ,car.group.position.y + 60,60);

//Create Stopwatches
var stopwatch = new Stopwatch();
var swLaps = new Stopwatch();


//Move

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
    direction = -2;
    car.accelerate(direction, speedway);
  }

  var angle = degreesToRadians(3);
  if ( keyboard.pressed(",") )  car.group.rotateY(  angle );
  if ( keyboard.pressed(".") ) car.group.rotateY( -angle );

  if ( keyboard.pressed("left") ){
    car.goLeft(angle);
  }else{
    car.stop();
  }
  if ( keyboard.pressed("right") ){
   car.goRight(angle);
  }


  if(direction == 0)  car.slowdown();
  car.group.translateZ(car.velocity);

}

//Camera

function cameraControl()
{
  changeCamera();
  
  if (cameraFree)
  {
    trackballControls.update();
    trackballControls.target.set( car.group.position.x, car.group.position.y, car.group.position.z );
  }
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
      speedway.blocks.forEach(function(block){
        block.cube.visible = true;
        block.cubeFundo.visible = true;
      })
      plane.visible = true;
    
    }
    else 
    {
      // Quando ativado o trackball
      // Arrumar Posicao
      trackballControls.reset;
      trackballControls.target.set( car.group.position.x, car.group.position.y, car.group.position.z );
      TrackballCamera.up.set( 0,1,0 );
      TrackballCamera.position.set(car.group.position.x + 50, 50, car.group.position.z + 50);
      TrackballCamera.lookAt(car.group.position);
      
      // Desativar visibilidade de outros objetos
      speedway.blocks.forEach(function(block){
        block.cube.visible = false;
        block.cubeFundo.visible = false;
      })

      plane.visible = false;
    }
}

function cameraFollow()
{
  var objectToFollow = car.group;
  var dir = new THREE.Vector3();
  car.group.getWorldDirection(dir);
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
function updateLapInfo() {
  stopwatchInfo.changeStopwatch(stopwatch.format);
  stopwatchInfo.changeLap("Lap: " + car.lap + "/4");

  if((car.lap == 1) && firstLapFlag){
    stopwatchInfo.add("Lap 1: " + swLaps.format);
    lapTimes.push(swLaps.format);
    swLaps.clear();
    firstLapFlag = false;
  }else {
    if((car.lap == 2) && secLapFlag){
      stopwatchInfo.add("Lap 2: " + swLaps.format);
      lapTimes.push(swLaps.format);
      swLaps.clear();
      secLapFlag = false;
    }else{
      if((car.lap == 3) && thirdLapFlag){
        stopwatchInfo.add("Lap 3: " + swLaps.format);
        lapTimes.push(swLaps.format);
        swLaps.clear();
        thirdLapFlag = false;
      }else{
        if((car.lap == 4) && fourthLapFlag){
          stopwatchInfo.add("Lap 4: " + swLaps.format);
          lapTimes.push(swLaps.format);
          swLaps.clear();
          fourthLapFlag = false;
        }
      }
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

render();
function render()
{
  stats.update(); // Update FPS
  if(gameIsOnFlag){
    keyboardUpdate();
    car.movement(speedway);
  }
  updateLapInfo();
  isGameOver();
  cameraControl();
  requestAnimationFrame(render);
  cameraRenderer(); // Render scene 
}