import * as THREE from '../../build/three.module.js';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';

export class Block{
    
    constructor(x, y, z, initial, muro, zMuro){
        this.x = x;
        this.y = y;
        this.z = z;
        this.initial = initial;
        this.passedBy = false;
        this.blockSize = 40;
        this.transformAux = null;
        this.body;
        
        /*
        var cubeGeometry = new THREE.BoxGeometry(this.blockSize*0.98, 0.3, this.blockSize*0.98);
        var cubeGeometry2 = new THREE.BoxGeometry(this.blockSize, 0.2, this.blockSize);
        var cubeMaterial2 = new THREE.MeshPhongMaterial({color: "rgba(255, 0, 0)", side: THREE.DoubleSide,});
        if(initial){
            var cubeMaterial = new THREE.MeshPhongMaterial({color: "rgba(255, 126, 0)", side: THREE.DoubleSide,});
        }else{
            var cubeMaterial = new THREE.MeshPhongMaterial({color: "rgba(235, 235, 220)", side: THREE.DoubleSide,});
        }        
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.position.set(x, y, z);

        this.cubeFundo = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
        this.cubeFundo.position.set(x, y, z);
        */
        
           
        this.pos = new THREE.Vector3(this.x, this.y, this.z);
        this.zeroQuartenion = new THREE.Quaternion(0, 0, 0, 1);
        
        if(muro){
            var muroMaterial = new THREE.MeshPhongMaterial({color: "rgba(0, 0, 0)", side: THREE.DoubleSide,});
            if(zMuro){
                this.cube = this.createBox(this.pos, this.zeroQuartenion, this.blockSize, 5, this.blockSize*0.10, 2, muroMaterial, true);
            }else{
                this.cube = this.createBox(this.pos, this.zeroQuartenion, this.blockSize*0.10, 5, this.blockSize, 2, muroMaterial, true);
            }
            
        }else{
            var cubeMaterial2 = new THREE.MeshPhongMaterial({color: "rgba(255, 0, 0)", side: THREE.DoubleSide,});

            if(initial){
                var cubeMaterial = new THREE.MeshPhongMaterial({color: "rgba(255, 126, 0)", side: THREE.DoubleSide,});
            }else{
                var cubeMaterial = new THREE.MeshPhongMaterial({color: "rgba(235, 235, 220)", side: THREE.DoubleSide,});
            }

            this.cube = this.createBox(this.pos, this.zeroQuartenion, this.blockSize*0.98, 0.2, this.blockSize*0.98, 2, cubeMaterial, true);
            this.cubeFundo = this.createBox(this.pos, this.zeroQuartenion, this.blockSize, 0.1, this.blockSize, 2, cubeMaterial2, true);
        }
    }

    get block() {
        return this.cube;
    }
    get fundo(){
        return this.cubeFundo;
    }

    createBox(pos, quat, w, l, h, friction = 1, material, receiveShadow = false) {
        if(!this.transformAux)
            this.transformAux = new Ammo.btTransform();
        var shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
        var geometry = new Ammo.btBoxShape(new Ammo.btVector3(w * 0.5, l * 0.5, h * 0.5));
    
        var mesh = new THREE.Mesh(shape, material);
            mesh.castShadow = true;
            mesh.receiveShadow = receiveShadow;
        mesh.position.copy(pos);
        mesh.quaternion.copy(quat);
        //scene.add( mesh );
    
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        var motionState = new Ammo.btDefaultMotionState(transform);
    
        var localInertia = new Ammo.btVector3(0, 0, 0);
        geometry.calculateLocalInertia(0, localInertia);
    
        var rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, geometry, localInertia);
        this.body = new Ammo.btRigidBody(rbInfo);
        this.body.setFriction(friction);
    
        return mesh;
    }
}

export class Speedway{
    constructor(sideSize, type){
        this.blockSize = 40;
        this.xInitialBlock = 0;
        this.yInitialBlock = 0.1;
        this.zInitialBlock = (sideSize*this.blockSize)/2;
        this.sideSize = sideSize;
        this.type = type;
        this.blocks = [new Block(this.xInitialBlock, this.yInitialBlock, this.zInitialBlock, true, false, false)];
        this.muroDentro = [new Block(this.xInitialBlock, this.yInitialBlock, this.zInitialBlock - (this.blockSize/2), false, true, true)]
        this.muroFora = [new Block(this.xInitialBlock, this.yInitialBlock, this.zInitialBlock + (this.blockSize/2), false, true, true)]
        this.xPos = this.xInitialBlock;
        this.zPos = this.zInitialBlock;
        this.cornersX = [];
        this.cornersZ = [];
        this.piecesCount = 0;
        if(type == 1) this.createTrack1();
        if(type == 2) this.createTrack2();
    }

    addBlock(x, y, z){
        this.blocks.push(new Block(x, y, z, false, false, false));
    }

    addMuroZ(x, y, z){ //Adiciona o muro distanciado entre si no eixo Z
        this.muroDentro.push(new Block(x, y, z - (this.blockSize/2), false, true, true));
        this.muroFora.push(new Block(x, y, z + (this.blockSize/2), false, true, true));
    }

    addMuroX(x, y, z){ //Adiciona o muro distanciado entre si no eixo X
        this.muroDentro.push(new Block(x - (this.blockSize/2), y, z, false, true, false));
        this.muroFora.push(new Block(x + (this.blockSize/2), y, z, false, true, false));
    }

    createTrack1() 
    {
        for(var i= 1; i<this.sideSize/2; i++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
        //Fix muro
        this.muroDentro.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroFora.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize; i++){
            this.zPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }

        //Fix muro
        this.muroFora.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroFora.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize; i++){
            this.xPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }

        //Fix muro
        this.muroFora.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize; i++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }

        //Fix muro
        this.muroDentro.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro .pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =2; i<this.sideSize/2; i++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
        if(this.sideSize%2 == 0){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
    }

    createTrack2() 
    {        
        for(var i =1; i<this.sideSize/2; i++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);
        
        for(var i =1; i<this.sideSize; i++){
            this.zPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize/2; i++){
            this.xPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize/2; i++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize/2; i++){
            this.xPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize/2; i++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =2; i<this.sideSize/2; i++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }
    }
}

export class LapInfo
{
  constructor(defaultText) {
    this.box = document.createElement('div');
    this.box.id = "box";
    this.box.style.padding = "6px 14px";
    this.box.style.top = "0";
    this.box.style.left= "0";
    this.box.style.position = "fixed";
    this.box.style.backgroundColor = "rgba(100,100,255,0.3)";
    this.box.style.color = "white";
    this.box.style.fontFamily = "sans-serif";
    this.box.style.fontSize = "16px";

    this.stopwatch = document.createTextNode(defaultText);
    this.box.appendChild(this.stopwatch);
    this.addParagraph();
    this.lap = document.createTextNode(defaultText);
    this.box.appendChild(this.lap);
    this.addParagraph();
    this.actualLap = document.createTextNode(defaultText);
    this.box.appendChild(this.actualLap);
    this.addParagraph();
    this.bestLap = document.createTextNode("Best Lap: 00:00");
    this.box.appendChild(this.bestLap);
    document.body.appendChild(this.box);
  }
  changeStopwatch(newText) {
    this.stopwatch.nodeValue = newText;
  }
  changeLap(newText){
    this.lap.nodeValue = newText;
  }
  changeActualLap(newText){
    this.actualLap.nodeValue = newText;
  }
  changeBestLap(newText){
    this.bestLap.nodeValue = newText;
  }
  
  add(text) {
    this.addParagraph();
    var textnode = document.createTextNode(text);
    this.box.appendChild(textnode);
  }

  addParagraph() {
    const paragraph = document.createElement("br")
    this.box.appendChild(paragraph);              ;
  }
}

export class Stopwatch{
    constructor(){
        this.hh = 0;
        this.mm = 0;
        this.ss = 0;
        this.ms = 0;
        this.tempo = 10; //num de milésimos por ms
        this.cron;
        this.format = "00:00";
    }

    start() {
        this.cron = setInterval(() => {this.timer();}, this.tempo);
    }

    pause() {
        clearInterval(this.cron);
    }

    clear(){
        this.hh = 0;
        this.mm = 0;
        this.ss = 0;
        this.ms = 0;
        this.format = (this.mm < 10 ? '0'+this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss);
    }

    stop() {
        clearInterval(this.cron);
        this.hh = 0;
        this.mm = 0;
        this.ss = 0;
        this.ms = 0;
        this.format = (this.mm < 10 ? '0'+this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss); 
    }
    timer(){

        this.ms++;

        if(this.ms == 100){
            this.ms = 0;
            this.ss++;

            if(this.ss == 60){
                this.ss = 0;
                this.mm++;
                if(this.mm == 60){
                    this.mm = 0;
                    this.hh++;
                }
            }
        }

        this.format = (this.mm < 10 ? '0'+this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss);
    }
}

export class gameInfo{
    constructor() {
        this.infoBox = document.createElement('div');
        this.infoBox.id = "InfoxBox";
        this.infoBox.style.padding = "6px 14px";
        this.infoBox.style.position = "fixed";
        this.infoBox.style.bottom = "0";
        this.infoBox.style.left = "0";
        this.infoBox.style.backgroundColor = "rgba(255,255,255,0.7)";
        this.infoBox.style.color = "white";
        this.infoBox.style.fontFamily = "sans-serif";
        this.infoBox.style.userSelect = "none";
        this.infoBox.style.textAlign = "left";
      }
    
      addParagraph() {
        const paragraph = document.createElement("br")
        this.infoBox.appendChild(paragraph);              ;
      }
    
      add(text) {
        var textnode = document.createTextNode(text);
        this.infoBox.appendChild(textnode);
        this.addParagraph();
      }
    
      show() {
        document.body.appendChild(this.infoBox);
      }
}
