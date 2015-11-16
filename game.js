var svgContainer,circle,windowsize;
var click = 1;
var game01 = new game("Pedro", 10)

//-----------------------------------------------------------------------------------------------------------------GAME CLASS

function game(playerName){

	this.screenWidth = window.innerWidth;
	this.scrennHeight = window.innerHeight;

	this.player = playerName || ""
	this.level = ""
	this.menu = {}

	// svgContainer
	this.container = d3.select("body").append("svg").attr("width", this.screenWidth).attr("height", this.scrennHeight);

	//Header menu
	this.headerHeigth = 0.08
	this.headerMenu = this.container.append("rect").attr("x", 0).attr("y",0).attr("width", this.screenWidth).attr("height", this.scrennHeight*this.headerHeigth );

}

game.prototype.generateLevel = function(_name){

	this.level = new experiment(this.headerHeigth,this.container)
}

game.prototype.displayLevel = function(levelName){
	//create new experiment 
	// each level will be internally called experiment
}

game.prototype.displayWin = function(){
}

game.prototype.displayLoose = function(){
}

game.prototype.playerName = function(){
	console.log(this.player)
}

game.prototype.update = function(){

	this.screenWidth = window.innerWidth;
	this.scrennHeight = window.innerHeight;
	this.container.attr("width", this.screenWidth).attr("height", this.scrennHeight);
	this.headerMenu.attr("width", this.screenWidth).attr("height", this.scrennHeight*this.headerHeigth);


}

//------------------------------------------------------------------------------------EXPERIMENT CLASS

//internally refered as experiment but externally referenced as level
function experiment(_headerHeight,container){

	this.container = container
	this.SVGs = []

	this.width = window.innerWidth
	this.height = window.innerHeight - (window.innerHeight*_headerHeight); // minus menu header

	//Paddings
	this.Padding = 10;

	//scene 
	this.scene = {
		"width" : (window.innerWidth*0.70)-2*this.Padding,
		"height" : this.height-2*this.Padding,
		"x" : 0+this.Padding,
		"y" : window.innerHeight*_headerHeight+this.Padding, 
	}

	//WidgetArea
	this.dashBoard = {
		"x" : this.scene.width+(3*this.Padding),
		"y" : window.innerHeight*_headerHeight+this.Padding,
		"width" : (window.innerWidth*0.30)-2*this.Padding,
		"height" : this.height-2*this.Padding,
	}

	//Widgets
	this.widgets = []
	this.WidgetsPos = []
	this.numberOfWidgets = 0


	// visualizations
	this.sceneSVG =  container.append("rect")
					.attr("x", this.scene.x )
					.attr("y", this.scene.y)
					.attr("width", this.scene.width)
					.attr("height",this.scene.height)
					.style("fill", "#69d3bf")


	this.widgetAreaSVG =  container.append("rect")
					.attr("x",this.dashBoard.x)
					.attr("y",this.dashBoard.y)
					.attr("width", this.dashBoard.width)
					.attr("height",this.dashBoard.height)
					.style("fill", "#69d30f")

}

//
experiment.prototype.addSVG = function(_description){

	console.log("----");

	description = _description || {
		"id" : "circle",
		"type" : "circle", 
		"x" :100,
		"y" :100, 
		"r" : 10,
		"width" : 100,
		"height" : 100,
		"fill": "#69d30f",
		"click" : ""
	}

	this.SVGs.push(description)
	console.log(this.SVGs)
}


experiment.prototype.drawSVG = function(){

	console.log(this.SVGs)

	for(var i=0;i<this.SVGs.length;i++){

		var description = this.SVGs[i];

		this.container.append(description.type)
			.attr("cx",description.x)
			.attr("cy",description.y)	
			.attr("r",description.r)
			.attr("width",description.width)
			.attr("height",description.height)
			.attr("fill",description.fill)
			.on("click", description.click)

	}
}

experiment.prototype.updateSVG = function(){
}


//-----------------------------------------------------------------------------------------------------------Mastermind Class

function Mastermind(_pegs,_colors,_secretContructor){

	this.playerWon = false;

	var colorsPool = [

		["red", "#F45858"],
		["orange" , "#EA9950"],
		["yellow" , "#F7D239"],
		["lightgreen" , "#B1D850"],
		["darkgreen" , "#287748"],
		["lightblue"  , "#5DEDC0"],
		["darkblue" , "#5E94EA"],
		["purple" , "#EB260E8"],
	]

	this.colors = []
	this.secret = []

	for (var i=0; i<_colors; i++){
		this.colors.push(colorsPool[i])
	}
 
	for (var i=0;i<_pegs;i++){
		this.secret.push(colorsPool[i][0])
	}

	this.secretContructor = _secretContructor || [1,1,1,1,1,1,1,1]



	for(var i=0; i<this.colors.length; i++){
		 
		 object = {
		 	"type" : "circle",
		 	"x" : (i*10)+20,
		 	"y" : 10,
		 	"r" : 10,
		 	"fill": this.colors[i][1],
		 	"click" : function(){
		 			console.log(game01.level.container[0]["0"])
		 	}
		}

		//game01.level.scene.addSVG(object)
		game01.level.addSVG(object)
	}

	game01.level.drawSVG();
}
//----------------------------GLOBALS


function setup(){

	w = window.innerWidth;
	h = window.innerHeight;

	 game01.generateLevel ("level01")
	 mmgame = new Mastermind(3,4,1);

}

function update(){

	game01.update()
}


function redefineWindowSize(){
	update();
}

function handleStorage(){
	//console.log(localStorage)
}

setup();
update();
window.addEventListener("resize", redefineWindowSize);


