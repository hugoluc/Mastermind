var jsonLoaded = false;
document.addEventListener("DOMContentLoaded",load);

function load(){
  var body = document.getElementById("body");
  body.addEventListener("click",GetJson);
  console.log("loaded");
}

function GetJson(){
  if(!jsonLoaded){
   loadJSON('http://104.131.172.143:3000/showAll', useData);
  }
  jsonLoaded = true;
}

function useData(positions){
  console.log(positions);
}

//------------------------------------------------------------------------------


var head;
var horn;
var aPressed;
var bPressed
var playerGuess;
var Foo = new Object();


function preload(){
  console.log("preload");
  head = loadImage("sprites/head.png");
  horn = loadImage("sprites/horn.png")
}


function setup() {
  console.log("setup");
  createCanvas(windowWidth, windowHeight);
  background(0);
  Foo.create(100,100,100,"extra");
  console.log(Foo.posX);
}

function draw() {

	Foo.spriteDisplay();

}

//================================

function Object() {
	var posX = 0;
}

Object.prototype.create = function ( _x,  _y, _lsize, type) {  
    this.type = type
    this.posX = _x; 
    this.posY = _y;
    this.lSize = _lsize;
  	
  	//return this;
}

Object.prototype.spriteDisplay = function () {

    var size = this.lSize;
    var x = this.posX;
    var y = this.posY;

    var hornSize = size/1.4


    imageMode(CENTER);
    image(head,x,y,size,size);
  
    
    if(this.type == "extra"){
      image(horn,x,y-size/2,10,hornSize);  
    } else{


    }

    //return this;
}




