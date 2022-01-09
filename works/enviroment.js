import * as THREE from '../../build/three.module.js';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';
import { degreesToRadians} from "../libs/util/util.js";

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
        
           
        this.pos = new THREE.Vector3(this.x, this.y, this.z);
        this.zeroQuartenion = new THREE.Quaternion(0, 0, 0, 1);
        
        if(muro){
            var muroMaterial = new THREE.MeshPhongMaterial({color: "rgba(0, 0, 0)", side: THREE.DoubleSide,});
            if(zMuro){
                this.cube = this.createBox(this.pos, this.zeroQuartenion, this.blockSize, 5, this.blockSize*0.10, 2, muroMaterial, true, true);
            }else{
                this.cube = this.createBox(this.pos, this.zeroQuartenion, this.blockSize*0.10, 5, this.blockSize, 2, muroMaterial, true, true);
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

    createBox(pos, quat, w, l, h, friction = 1, material, receiveShadow = false, muro = false) {
        if(!this.transformAux)
            //this.transformAux = new Ammo.btTransform();
        var shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
        if(muro)
            var geometry = new Ammo.btBoxShape(new Ammo.btVector3(w * 0.5, l * 2.3, h * 0.5));
        else
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

export class Ramp{

    constructor(x, y, z, blockSize){
        this.transformAux = null;
        this.body;
        this.ramp = new THREE.Group();;
        this.angle = -15;

        var quaternion = new THREE.Quaternion(0, 0, 0, 1);
        var rampMaterial = new THREE.MeshPhongMaterial({color: "rgba(235, 235, 220)", side: THREE.DoubleSide,});
        var vec = new THREE.Vector3(0, 0, 1);
        quaternion.setFromAxisAngle(vec , degreesToRadians(this.angle));
        var baseQuartenion = new THREE.Quaternion(0, 0, 0, 1);	

        var ramp1 = this.createBox(new THREE.Vector3(x, y ,z), quaternion, (blockSize/2), blockSize/4, blockSize*0.9, 0, rampMaterial, true);
        this.bodys = [this.body];
        var base = this.createBox(new THREE.Vector3(x- (blockSize*0.65), y, z), baseQuartenion, blockSize*0.9, blockSize*0.37, blockSize*0.9, 0, rampMaterial, true);
        this.bodys.push(this.body);

        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), degreesToRadians(-this.angle));

        var ramp2 = this.createBox(new THREE.Vector3(x-(blockSize*1.3), y, z), quaternion, (blockSize/2), blockSize/4, blockSize*0.9, 0, rampMaterial, true);
        this.bodys.push(this.body);

        this.ramp.add(ramp1);
        this.ramp.add(base);
        this.ramp.add(ramp2);	
    }

    createBox(pos, quat, w, l, h, friction = 1, material, receiveShadow = true) {
        if(!this.transformAux)
            this.transformAux = new Ammo.btTransform();
        var shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
        var geometry = new Ammo.btBoxShape(new Ammo.btVector3(w * 0.5, l * 0.5, h * 0.5));
    
        var mesh = new THREE.Mesh(shape, material);
            mesh.castShadow = false;
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
        if(type == 3){
            this.xInitialBlock = - (sideSize*this.blockSize)/2;
            this.yInitialBlock = 0.1;
            this.zInitialBlock = 0;
            this.sideSize = sideSize;
            this.type = type;
            this.blocks = [new Block(this.xInitialBlock, this.yInitialBlock, this.zInitialBlock, true, false, false)];
            this.muroDentro = [new Block(this.xInitialBlock - (this.blockSize/2), this.yInitialBlock, this.zInitialBlock, false, true, false)];
            this.muroFora = [new Block(this.xInitialBlock + (this.blockSize/2), this.yInitialBlock, this.zInitialBlock , false, true, false)];
            this.xPos = this.xInitialBlock;
            this.zPos = this.zInitialBlock;
            this.ramps = [new RampZ(this.xPos, (this.yInitialBlock-2), (this.zPos + 3*this.blockSize), this.blockSize)];

        }else{
            this.xInitialBlock = 0;
            this.yInitialBlock = 0.1;
            this.zInitialBlock = (sideSize*this.blockSize)/2;
            this.sideSize = sideSize;
            this.type = type;
            this.blocks = [new Block(this.xInitialBlock, this.yInitialBlock, this.zInitialBlock, true, false, false)];
            this.muroDentro = [new Block(this.xInitialBlock, this.yInitialBlock, this.zInitialBlock - (this.blockSize/2), false, true, true)];
            this.muroFora = [new Block(this.xInitialBlock, this.yInitialBlock, this.zInitialBlock + (this.blockSize/2), false, true, true)];
            this.xPos = this.xInitialBlock;
            this.zPos = this.zInitialBlock;
            if(type !=4)
                this.ramps = [new Ramp((this.xPos - 3*this.blockSize), (this.yInitialBlock-2), this.zPos, this.blockSize)];
            else
                this.ramps = [new RampZ((this.xPos - 3*this.blockSize), (this.yInitialBlock-2), this.zPos - (this.sideSize*this.blockSize)/4, this.blockSize)];
        }
        this.cornersX = [];
        this.cornersZ = [];
        this.piecesCount = 0;
        if(type == 1) this.createTrack1();
        if(type == 2) this.createTrack2();
        if(type == 3) this.createTrack3();
        if(type == 4) this.createTrack4();

        
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

    addRamp(x, y, z){
        this.ramps.push(new Ramp(x, y-this.blockSize*0.05, z, this.blockSize));
    }

    addRampZ(x, y, z){
        this.ramps.push(new RampZ(x, y-this.blockSize*0.05, z, this.blockSize));
    }

    addXRamp(x, y, z, isZ){
        this.ramps.push(new XRamp(x, y-this.blockSize*0.05, z, this.blockSize, isZ));
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
        this.addRampZ(this.xPos , this.yInitialBlock, this.zPos + (this.sideSize*this.blockSize)/2);

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
        this.addRamp((this.xPos - (this.sideSize*this.blockSize)/2), this.yInitialBlock, this.zPos);

        //Fix muro
        this.muroFora.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize; i++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }

        this.addRampZ(this.xPos , this.yInitialBlock, this.zPos - (this.sideSize*this.blockSize)/2);

        //Fix muro
        this.muroDentro.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro .pop();

        //Checkpoint pra completar a volta
    
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
        this.addRampZ(this.xPos , this.yInitialBlock, this.zPos + (this.sideSize*this.blockSize)/2);

        //Fix muro
        this.muroFora.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroFora.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize/2; i++){
            this.xPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.addRamp((this.xPos - ((this.sideSize/2)*this.blockSize)/2), this.yInitialBlock, this.zPos);

        //Fix muro
        this.muroFora.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        //Checkpoint pra completar a volta

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize/2; i++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.addRampZ(this.xPos , this.yInitialBlock, this.zPos - ((this.sideSize/2)*this.blockSize)/2);

        //Fix muro
        this.muroFora.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro .pop();

        //Checkpoint pra completar a volta

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize/2; i++){
            this.xPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.addRamp((this.xPos - ((this.sideSize/2)*this.blockSize)/2), this.yInitialBlock, this.zPos);

        //Fix muro
        this.muroFora.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        //Checkpoint pra completar a volta

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize/2; i++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.addRampZ(this.xPos , this.yInitialBlock, this.zPos - ((this.sideSize/2)*this.blockSize)/2);

        //Fix muro
        this.muroDentro.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro .pop();

        //Checkpoint pra completar a volta

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =2; i<this.sideSize/2; i++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
    }

    createTrack3() 
    {
        var x = 0;
        var zL = 0;
        var zR = 0;
        for(zL= 0; zL<this.sideSize/4; zL++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }
        //Fix muro
        this.muroFora.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(x=0; x<this.sideSize/4; x++){
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
        this.cornersZ.push(this.zPos);

        for(zL; zL<this.sideSize/2; zL++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }

        //Fix muro
        this.muroFora.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(x; x<this.sideSize; x++){
            this.xPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.addRamp(this.xPos - (this.sideSize*this.blockSize)/3, this.yInitialBlock, this.zPos);

        //Fix muro
        this.muroDentro.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        
        this.addRampZ(this.xPos, this.yInitialBlock, this.zPos - (this.sideSize*this.blockSize)/4);

        for(zR=0; zR<this.sideSize/2; zR++){
            this.zPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }

        //console.log("zPos: " + this.zPos + " xPos: "+ this.xPos + " " + this.sideSize*this.blockSize);

        //Fix muro
        this.muroDentro.pop();
        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(zR; zR<this.sideSize; zR++){
            this.zPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }

        //Fix muro
        this.muroDentro.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroFora.pop();

        for(x=1; x<this.sideSize/2; x++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.zPos = 0;
        this.xPos = (this.sideSize*this.blockSize)/2;
        this.muroFora.pop();

        for(x=1; x<this.sideSize/2; x++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }

        //Fix muro
        this.muroDentro.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroFora.pop();

        for(zR = this.sideSize/2+1; zR<this.sideSize; zR++){
            this.zPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.muroFora.pop();
        this.muroDentro.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(x= x-1; x<this.sideSize; x++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.addRamp(this.xPos + (this.sideSize*this.blockSize)/3, this.yInitialBlock, this.zPos);
        //Fix muro
        this.muroFora.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroFora.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(zL=zL+1; zL<this.sideSize; zL++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }
    }

    createTrack4(){
        var xI = 0;
        var xV = 0;
        var zI = 0;
        var zV = 0;
        var auxMuro = 0;

        for(xI; xI<this.sideSize/6; xI++){
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

        for(zI; zI<(this.sideSize/3)*2; zI++){
            auxMuro++;
            this.zPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
            if(auxMuro == 7){
                this.muroFora.pop();
            }
            
        }

        //Fix muro
        this.muroDentro.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroFora.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);
        
        auxMuro = 0;
        for(xI; xI<((this.sideSize/6)+(this.sideSize/2)); xI++){
            auxMuro++;
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
            if(auxMuro==3)
                this.muroFora.pop();
        }
        //Fix muro
        this.muroDentro.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroFora.pop();

        for(zI; zI<this.sideSize; zI++){
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
        
        for(xV; xV<this.sideSize/4; xV++){
            this.xPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
        //Fix muro
        this.muroFora.pop();
        this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        

        for(zV=1; zV<(this.sideSize/3); zV++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.addXRamp(this.xPos, this.yInitialBlock, this.zPos - (this.blockSize/4) , true);
        this.zPos += this.blockSize;
        
        for(zV; zV<(this.sideSize/6)*3; zV++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }
        //Fix muro
        this.muroFora.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        //Checkpoint pra completar a volta
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(xV; xV<((this.sideSize/3)*2 - this.sideSize/4 - 1); xV++){
            this.xPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
        this.addXRamp(this.xPos - (this.blockSize/4), this.yInitialBlock, this.zPos, false);
        this.xPos += this.blockSize;
        for(xV -= 1; xV<this.sideSize; xV++){
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
        this.cornersZ.push(this.zPos);

        for(zV; zV<this.sideSize; zV++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroX(this.xPos, this.yInitialBlock, this.zPos);
        }
        //Fix muro
        this.muroDentro.pop();
        this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        this.muroDentro.pop();

        for(xI; xI<=this.sideSize; xI++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
            this.addMuroZ(this.xPos, this.yInitialBlock, this.zPos);
        }
    }
}

export class RampZ{

    constructor(x, y, z, blockSize){
        this.transformAux = null;
        this.body;
        this.ramp = new THREE.Group();;
        this.angle = -15;

        var quaternion = new THREE.Quaternion(0, 0, 0, 1);
        var rampMaterial = new THREE.MeshPhongMaterial({color: "rgba(235, 235, 220)", side: THREE.DoubleSide,});
        var vec = new THREE.Vector3(1, 0, 0);
        quaternion.setFromAxisAngle(vec , degreesToRadians(-this.angle));
        var baseQuartenion = new THREE.Quaternion(0, 0, 0, 1);	

        var ramp1 = this.createBox(new THREE.Vector3(x, y ,z), quaternion, blockSize*0.9, blockSize/4, (blockSize/2), 0, rampMaterial, true);
        this.bodys = [this.body];
        var base = this.createBox(new THREE.Vector3(x, y, z - (blockSize*0.65)), baseQuartenion, blockSize*0.9, blockSize*0.37, blockSize*0.9, 0, rampMaterial, true);
        this.bodys.push(this.body);

        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), degreesToRadians(   this.angle));

        var ramp2 = this.createBox(new THREE.Vector3(x, y, z-(blockSize*1.3)), quaternion, blockSize*0.9, blockSize/4, (blockSize/2), 0, rampMaterial, true);
        this.bodys.push(this.body);

        this.ramp.add(ramp1);
        this.ramp.add(base);
        this.ramp.add(ramp2);	
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

export class XRamp{

    constructor(x, y, z, blockSize, isZ){
        this.transformAux = null;
        this.body;
        this.ramp = new THREE.Group();;
        this.angle = -20;

        var quaternion = new THREE.Quaternion(0, 0, 0, 1);
        var rampMaterial = new THREE.MeshPhongMaterial({color: "rgba(235, 235, 220)", side: THREE.DoubleSide,});
        var vec = new THREE.Vector3(1, 0, 0);
        quaternion.setFromAxisAngle(vec , degreesToRadians(this.angle));


        if(isZ)
            this.ramp = this.createBox(new THREE.Vector3(x, y ,z), quaternion, blockSize*0.9, blockSize/4, (blockSize/2), 0, rampMaterial, true);
        else{
            quaternion = new THREE.Quaternion(0, 0, 0, 1);
            quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1) , degreesToRadians(-this.angle));
            this.ramp = this.createBox(new THREE.Vector3(x, y ,z), quaternion, (blockSize/2), blockSize/4, blockSize*0.9, 0, rampMaterial, true);
        }
        this.bodys = [this.body];

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
        this.box.style.backgroundColor = "rgba(0,0,0,2)";
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
