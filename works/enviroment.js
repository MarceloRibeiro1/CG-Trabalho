import * as THREE from '../../build/three.module.js';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';

export class Block{
    
    constructor(x, y, z, initial){
        this.x = x;
        this.y = y;
        this.z = z;
        this.initial = initial;
        this.passedBy = false;
        this.blockSize = 20;

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
        //scene.add(cube)
    }

    get block() {
        return this.cube;
    }
    get fundo(){
        return this.cubeFundo;
    }
}

export class Speedway{
    constructor(sideSize, type){
        this.blockSize = 20;
        this.xInitialBlock = 0;
        this.yInitialBlock = 0.1;
        this.zInitialBlock = (sideSize*this.blockSize)/2;
        this.sideSize = sideSize;
        this.type = type;
        this.blocks = [new Block(this.xInitialBlock, this.yInitialBlock, this.zInitialBlock, true)];
        this.xPos = this.xInitialBlock;
        this.zPos = this.zInitialBlock;
        this.cornersX = [];
        this.cornersZ = [];
        this.piecesCount = 0;
        if(type == 1) this.createTrack1();
        if(type == 2) this.createTrack2();
    }

    addBlock(x, y, z){
        this.blocks.push(new Block(x, y, z, false));
    }

    createTrack1() 
    {
        for(var i= 1; i<this.sideSize/2; i++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);
        console.log(this.cornersX[0]);

        for(var i =1; i<this.sideSize; i++){
            this.zPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }
        
        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize; i++){
            this.xPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =1; i<this.sideSize; i++){
            this.zPos += this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }

        this.cornersX.push(this.xPos);
        this.cornersZ.push(this.zPos);

        for(var i =2; i<this.sideSize/2; i++){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
        }
        if(this.sideSize%2 == 0){
            this.xPos -= this.blockSize;
            this.addBlock(this.xPos, this.yInitialBlock, this.zPos, false);
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
    document.body.appendChild(this.box);
  }
  changeStopwatch(newText) {
    this.stopwatch.nodeValue = newText;
  }
  changeLap(newText){
    this.lap.nodeValue = newText;
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
        this.format = "00:00:00";
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
        this.format = (this.mm < 10 ? '0'+this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss) + ':' + (this.ms < 10 ? '0' + this.ms : this.ms);
    }

    stop() {
        clearInterval(this.cron);
        this.hh = 0;
        this.mm = 0;
        this.ss = 0;
        this.ms = 0;
        this.format = (this.mm < 10 ? '0'+this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss) + ':' + (this.ms < 10 ? '0' + this.ms : this.ms); 
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

        this.format = (this.mm < 10 ? '0'+this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss) + ':' + (this.ms < 10 ? '0' + this.ms : this.ms);
    }
}

export class gameInfo{
    constructor() {
        this.infoBox = document.createElement('div');
        this.infoBox.id = "InfoxBox";
        this.infoBox.style.padding = "6px 14px";
        this.infoBox.style.position = "fixed";
        this.infoBox.style.bottom = "0";
        this.infoBox.style.right = "0";
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

/*export function finishLap(blocks) {
    var finishedLap = true;
    blocks.forEach(function(block){
        if(block.passedBy == false)
        finishedLap = false;
    })
    return finishedLap;
}*/
/*
export function createTrack1(numBlocksPerSide) 
{
    var xPos = 0;
    var yPos = - (numBlocksPerSide*10)/2;
    var zPos = 0.1;
    var track = [new Block(xPos, yPos, zPos, true)];

    for(var i= 1; i<numBlocksPerSide/2; i++){
        xPos -= 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    for(var i =1; i<numBlocksPerSide; i++){
        yPos += 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    for(var i =1; i<numBlocksPerSide; i++){
        xPos += 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    for(var i =1; i<numBlocksPerSide; i++){
        yPos -= 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    for(var i =2; i<numBlocksPerSide/2; i++){
        xPos -= 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }
    if(numBlocksPerSide%2 == 0){
        xPos -= 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    return track;
}

export function createTrack2(numBlocksPerSide) 
{
    var xPos = 0;
    var yPos = - (numBlocksPerSide*10)/2;
    var zPos = 0.1;
    var track = [new Block(xPos, yPos, zPos, true)];
    
    for(var i =1; i<numBlocksPerSide/2; i++){
        xPos -= 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }
    
    for(var i =1; i<numBlocksPerSide; i++){
        yPos += 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    for(var i =1; i<numBlocksPerSide/2; i++){
        xPos += 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    for(var i =1; i<numBlocksPerSide/2; i++){
        yPos -= 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    for(var i =1; i<numBlocksPerSide/2; i++){
        xPos += 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    for(var i =1; i<numBlocksPerSide/2; i++){
        yPos -= 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    for(var i =2; i<numBlocksPerSide/2; i++){
        xPos -= 10;
        track.push(new Block(xPos, yPos, zPos, false));
    }

    return track;
}*/
