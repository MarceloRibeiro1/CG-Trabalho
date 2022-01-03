import * as THREE from '../../build/three.module.js';
import {degreesToRadians} from "../libs/util/util.js";

export class Car{
  constructor(type){
    
    this.group = new THREE.Group();
    this.lap = 0;
    this.cornersPassed = [false];
    this.cornerCount = 0;
    this.lapFlag = true;

    
    //Movement

    this.velocity = 0;
    this.acceleration = 0.05;
    this.maxVel = 1.5;
    this.track;
    this.slow = -0.05;


    // Structure:

    if(type == 1){
      this.body = createCube(5.0, 15.0, 3.0, 20.0, 20.0, 20.0, false);
      this.ceiling = createCube(5.0, 6.0, 2.0, 20, 20, 20, false); 
      this.axis1 = createCylinder(0.3, 0.3, 7.0, 10, 10, false);
      this.axis2 = createCylinder(0.3, 0.3, 7.0, 10, 10, false);
      this.roda1 = createTorus(2.0, 1.0, 40, 40, Math.PI * 2);
      this.roda2 = createTorus(2.0, 1.0, 40, 40, Math.PI * 2);
      this.roda3 = createTorus(2.0, 1.0, 40, 40, Math.PI * 2);
      this.roda4 = createTorus(2.0, 1.0, 40, 40, Math.PI * 2);
      this.airfoil = createCube(5.0, 1.0, 2.0, 20, 20, 20, false);
      this.visor = createCube(5.0, 0.2, 2.0, 20, 20, 20, true);
      this.placeCar1();

    }else{//Implements the type 2 car
      this.body = createCube(5.0, 15.0, 3.0, 20.0, 20.0, 20.0, false);
      this.ceiling = createCube(5.0, 10.0, 2.0, 20, 20, 20, false); // Adding the ceiling of the car
      this.axis1 = createCylinder(0.3, 0.3, 7.0, 10, 10, false);
      this.axis2 = createCylinder(0.3, 0.3, 7.0, 10, 10, false);
      this.roda1 = createTorus(2.0, 1.0, 40, 40, Math.PI * 2);
      this.roda2 = createTorus(2.0, 1.0, 40, 40, Math.PI * 2);
      this.roda3 = createTorus(2.0, 1.0, 40, 40, Math.PI * 2);
      this.roda4 = createTorus(2.0, 1.0, 40, 40, Math.PI * 2);
      this.airfoil = createCube(5.0, 1.0, 2.0, 20, 20, 20, false); // Adding airfoil
      this.visor = createCube(5.0, 0.2, 2.0, 20, 20, 20, true); // Adding the visor
      this.placeCar2();
    }

    this.group.add( this.body );
    this.group.add( this.axis1);
    this.group.add( this.axis2);
    this.group.add( this.roda1 );
    this.group.add( this.roda2 );
    this.group.add( this.roda3 );
    this.group.add( this.roda4 );
    this.group.add( this.ceiling);
    this.group.add( this.airfoil);
    this.group.add( this.visor);
  }

  placeInitialPosition(sideSize){
    this.group.translateZ((sideSize*20)/2);
    this.group.translateY(2);
    this.group.rotateY(degreesToRadians(-90));
  }

  placeCar1(){
    this.body.rotateX(degreesToRadians(90));
    this.body.position.set(0.0, 0.5, 0.0)
    this.ceiling.rotateX(degreesToRadians(90));
    this.ceiling.position.set(0.0, 3.0, 0.0);
    this.axis1.rotateZ(degreesToRadians(90));
    this.axis1.position.set(0.0, -1.0, 4.0);
    this.axis2.rotateZ(degreesToRadians(90));
    this.axis2.position.set(0.0, -1.0, -4.0);
    this.roda1.position.set( 3.5, -1.0, 4.0);
    this.roda2.position.set(-3.5, -1.0, 4.0);
    this.roda3.position.set(3.5, -1.0, -4.0);
    this.roda4.position.set(-3.5, -1.0, -4.0);
    this.airfoil.rotateX(degreesToRadians(90));
    this.airfoil.position.set(0.0, 2.0, -7.0);
    this.visor.rotateX(degreesToRadians(90));
    this.visor.position.set(0.0, 3.0, 3.1);

  }

  placeCar2(){
    this.body.rotateX(degreesToRadians(90));
    this.body.position.set(0.0, 0.5, 0.0)
    this.ceiling.rotateX(degreesToRadians(90));
    this.ceiling.position.set(0.0, 3.0, -2.0);
    this.axis1.rotateZ(degreesToRadians(90));
    this.axis1.position.set(0.0, -1.0, 4.0);
    this.axis2.rotateZ(degreesToRadians(90));
    this.axis2.position.set(0.0, -1.0, -4.0);
    this.roda1.position.set( 3.5, -1.0, 4.0);
    this.roda2.position.set(-3.5, -1.0, 4.0);
    this.roda3.position.set(3.5, -1.0, -4.0);
    this.roda4.position.set(-3.5, -1.0, -4.0);
    this.airfoil.rotateX(degreesToRadians(90));
    this.airfoil.position.set(0.0, 2.0, -7.0);
    this.visor.rotateX(degreesToRadians(90));
    this.visor.position.set(0.0, 3.0, 3.1);
  }

  isOnTheSpeedway(speedway){
    var isOnTheWay = false;
    var g = this.group;
    speedway.blocks.forEach(function(block){
        if((g.position.x >= (block.x - (speedway.blockSize*0.5)) && g.position.x <= (block.x + (speedway.blockSize*0.5))) && (g.position.z >= (block.z - (speedway.blockSize*0.5)) && g.position.z <= (block.z + (speedway.blockSize*0.5)))){
            isOnTheWay = true;
            block.passedBy = true;
        }
    })
    return isOnTheWay;
  }

  updateNumCorners(speedway){
    for(var i=1; i<speedway.cornersX.length; i++){ //Counts how much pieces the speedway has and add a false in cornersPassed for each one
      this.cornersPassed.push(false);
    }
  }

  movement(speedway){
        
    console.log("Has Passed: " + this.hasPassedRightWay());
    console.log("Lap: " + this.lap);
    if(this.hasPassedRightWay()){
      
      if(this.hitCorner(speedway)){
        console.log("Hit Corner:" + this.cornerCount );
        this.cornersPassed[this.cornerCount] = true;
        this.cornerCount +=1;
        this.lapFlag = true;
      }else{
        console.log("cornerCount == cornersX.length: " + (this.cornerCount == speedway.cornersX.length) );
        console.log("lapFlag: " + this.lapFlag);
        console.log("hitFinish: " + this.hitFinishLine(speedway));
        if( (this.cornerCount == speedway.cornersX.length) && this.lapFlag && this.hitFinishLine(speedway)){
          console.log("Hit finish line");
          this.lap++;
          console.log(this.lap);
          this.updateCornersPassed();
          this.cornerCount = 0;
          this.lapFlag = false;
        }
      }
    }
  }

  //Different tests if corners are greater than 0 or less than zero
  hitCorner(speedway){
    console.log(this.cornerCount);
    var conditionX;
    var conditionZ;

    if((speedway.cornersX[this.cornerCount] >= -5) && (speedway.cornersX[this.cornerCount] <= 5)){
      conditionX = (this.group.position.x >= -30 && this.group.position.x <=30);
    }else{
      if(speedway.cornersX[this.cornerCount] > 0){
        conditionX = (this.group.position.x >= (speedway.cornersX[this.cornerCount] - speedway.blockSize)) && (this.group.position.x <= (speedway.cornersX[this.cornerCount] + speedway.blockSize));
      }else{
        conditionX = ((this.group.position.x <= (speedway.cornersX[this.cornerCount] + speedway.blockSize)) && (this.group.position.x >= (speedway.cornersX[this.cornerCount] - speedway.blockSize)));
      }
    }

    if((speedway.cornersZ[this.cornerCount] >= -5) && (speedway.cornersZ[this.cornerCount] <= 5)){
      conditionZ = (this.group.position.z >= -30 && this.group.position.z <=30);
    }else{
      if(speedway.cornersZ[this.cornerCount] > 0){
        conditionZ = (this.group.position.z >= (speedway.cornersZ[this.cornerCount] - speedway.blockSize)) && (this.group.position.z <= (speedway.cornersZ[this.cornerCount] + speedway.blockSize));
      }else{
        conditionZ = (this.group.position.z <= (speedway.cornersZ[this.cornerCount] + speedway.blockSize)) && (this.group.position.z >= (speedway.cornersZ[this.cornerCount] - speedway.blockSize));
      }
    }

    return conditionX && conditionZ;
  }

  hitFinishLine(speedway){
    
    var conditionX;
    var conditionZ;

    //Different tests if corners are greater than 0 or less than zero

    if((speedway.xInitialBlock >= -5) && (speedway.xInitialBlock <= 5)){
      conditionX = (this.group.position.x >= -10 && this.group.position.x <=10);
    }else{
      if(speedway.xInitialBlock > 0){
        conditionX = (this.group.position.x >= speedway.xInitialBlock*0.85) && (this.group.position.x <= speedway.xInitialBlock[this.cornerCount]*1.15);
      }else{
        conditionX = ((this.group.position.x <= speedway.xInitialBlock[this.cornerCount]*0.85) && (this.group.position.x >= speedway.xInitialBlock[this.cornerCount]*1.15));
      }
    }

    if((speedway.zInitialBlock >= -5) && (speedway.zInitialBlock <= 5)){
      conditionZ = (this.group.position.z >= -10 && this.group.position.z <=10);
    }else{
      if(speedway.zInitialBlock > 0){
        conditionZ = (this.group.position.z >= speedway.zInitialBlock*0.85) && (this.group.position.z <= speedway.zInitialBlock*1.15);
      }else{
        conditionZ = (this.group.position.z <= speedway.zInitialBlock*0.85) && (this.group.position.z >= speedway.zInitialBlock*1.15);
      }
    }

    return conditionX && conditionZ;
  }

  hasPassedRightWay(){ // auxiliar function that checks if the car passed all corners in the right sequence
    var rightWay = true;
    for(var i=0; i<this.cornerCount; i++){
      if(this.cornersPassed[i] == false){
        rightWay = false;
      }
    }
    return rightWay;
  }

  updateCornersPassed(){
    for(var i=0; i<this.cornersPassed.length; i++){
      this.cornersPassed[i] = false;
    }
  }

  //Movement

  accelerate(dir, speedway){
    this.track = this.isOnTheSpeedway(speedway);
    var topVel = this.track ? this.maxVel : this.maxVel*0.5;
    if (Math.abs(this.velocity) < topVel)
    {
      this.velocity += this.acceleration*dir;
    }
    else
    {
      this.velocity += -dir*this.acceleration;
    }

  }

  slowdown()
    {
      if (this.velocity > 0.1)
      this.velocity += this.slow;
      else if (this.velocity < -0.1)
      this.velocity += -this.slow;
      else
      this.velocity = 0;
    }

    goLeft(angle)
  {
    this.roda1.matrixAutoUpdate = false;
    this.roda2.matrixAutoUpdate = false;
    this.axis1.matrixAutoUpdate = false;

    this.group.rotateY(  angle*Math.sign(this.velocity) );

    var mat4 = new THREE.Matrix4();

    this.roda1.matrix.identity();
    this.roda2.matrix.identity();
    this.axis1.matrix.identity();

    this.axis1.matrix.multiply(mat4.makeRotationY( degreesToRadians(5)));
    this.axis1.matrix.multiply(mat4.makeRotationZ( degreesToRadians(90)));
    this.axis1.matrix.multiply(mat4.makeTranslation(-1.0, 0.0, 4.0));

    this.roda1.matrix.multiply(mat4.makeRotationY( degreesToRadians(-50)));
    this.roda1.matrix.multiply(mat4.makeTranslation(5.5, -1.0, -1.0));

    this.roda2.matrix.multiply(mat4.makeRotationY( degreesToRadians(-50)));
    this.roda2.matrix.multiply(mat4.makeTranslation(1.0, -1.0, 5.5));
  }

  stop()
  {
    this.roda1.matrixAutoUpdate = false;
    this.roda2.matrixAutoUpdate = false;
    this.axis1.matrixAutoUpdate = false;

    var mat4 = new THREE.Matrix4();

    this.roda1.matrix.identity();
    this.roda2.matrix.identity();
    this.axis1.matrix.identity();

    this.axis1.matrix.multiply(mat4.makeRotationY( degreesToRadians(-5)));
    this.axis1.matrix.multiply(mat4.makeRotationZ( degreesToRadians(-90)));
    this.axis1.matrix.multiply(mat4.makeTranslation(1.0, 0.5, 4.0));

    this.roda1.matrix.multiply(mat4.makeRotationY( degreesToRadians(90)));
    this.roda1.matrix.multiply(mat4.makeTranslation(-4.0, -1.0, 3.5));

    this.roda2.matrix.multiply(mat4.makeRotationY( degreesToRadians(90)));
    this.roda2.matrix.multiply(mat4.makeTranslation(-4.0, -1.0,-3.5));
  }

  goRight(angle){
    this.roda1.matrixAutoUpdate = false;
    this.roda2.matrixAutoUpdate = false;
    this.axis1.matrixAutoUpdate = false;

    this.group.rotateY( -angle*Math.sign(this.velocity) );


    var mat4 = new THREE.Matrix4();

    this.roda1.matrix.identity();
    this.roda2.matrix.identity();
    this.axis1.matrix.identity();

    this.axis1.matrix.multiply(mat4.makeRotationY( degreesToRadians(-10)));
    this.axis1.matrix.multiply(mat4.makeRotationZ( degreesToRadians(90)));
    this.axis1.matrix.multiply(mat4.makeTranslation(-1.0, -0.5, 4.0));

    this.roda1.matrix.multiply(mat4.makeRotationY( degreesToRadians(50)));
    this.roda1.matrix.multiply(mat4.makeTranslation(-5.5, -1.0, 0.0));

    this.roda2.matrix.multiply(mat4.makeRotationY( degreesToRadians(50)));
    this.roda2.matrix.multiply(mat4.makeTranslation(-1.0, -1.0, 5.5));
  }

}







//Strucuture

function createCube(width, height, depth, widthSegments, heightSegments, depthSegments, color)
{
  var geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
  var material;
  if(!color)
    material = new THREE.MeshPhongMaterial({color:"rgb(255,216,1)"});
  else
    material = new THREE.MeshPhongMaterial({color:"rgb(0,0,0)"});
  var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
  return object;
}


function createCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, color)
{
  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
  var material;
  if(!color)
    material = new THREE.MeshPhongMaterial({color:"rgb(100,100,100)"});
  else
    material = new THREE.MeshPhongMaterial({color:"rgb(230,120,50)"});
  var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
  return object;
}

function createTorus(radius, tube, radialSegments, tubularSegments, arc)
{
  var geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
  var material = new THREE.MeshPhongMaterial({color:"rgb(27,27,27)"});
  var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.rotateY(degreesToRadians(90));
  return object;
}

function createSphere(radius, widthSegments, heightSegments)
{
  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
  var material = new THREE.MeshPhongMaterial({color:"rgb(255,255,50)"});
  var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
  return object;
}