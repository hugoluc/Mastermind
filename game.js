//-----------------------------------------------------------------------------------------------------------------GAME CLASS

function game(playerName){
	this.screenWidth = window.innerWidth;
	this.scrennHeight = window.innerHeight;

	this.player = playerName || ""
	this.experiment = ""
	this.menu = {}

	// svgContainer
	this.container = d3.select("body").append("svg").attr("width", this.screenWidth).attr("height", this.scrennHeight);

	//Header menu
	this.headerHeigth = 0.08
	this.headerMenu = this.container.append("rect").attr("x", 0).attr("y",0).attr("width", this.screenWidth).attr("height", this.scrennHeight*this.headerHeigth );
}

game.prototype.generateExperiment = function(_name){
	this.experiment = new experiment(this.headerHeigth,this.container)
}

game.prototype.displayLevel = function(levelName){
	//create new experiment 
	// each level will be internally called experiment
}

game.prototype.displayWin = function(){
}

game.prototype.displayLoose = function(){
}

game.prototype.update = function(_itemsToupdate){

	this.screenWidth = window.innerWidth;
	this.scrennHeight = window.innerHeight;
	this.container.attr("width", this.screenWidth).attr("height", this.scrennHeight);
	this.headerMenu.attr("width", this.screenWidth).attr("height", this.scrennHeight*this.headerHeigth);

}

//------------------------------------------------------------------------------------EXPERIMENT CLASS

//--------------------------------------------Experiment contructor
function experiment(_headerHeight,container){

	this.container = container
	this.SVGs = []

	this.width = window.innerWidth
	this.height = window.innerHeight - (window.innerHeight*_headerHeight); // minus menu header

	//Paddings
	this.Padding = 15;

	//scene 
	this.scene = {
		"width" : (window.innerWidth*0.70)-2*this.Padding,
		"height" : this.height-2*this.Padding,
		"x" : 0+this.Padding,
		"y" : window.innerHeight*_headerHeight+this.Padding, 
	}

	//WidgetArea
	this.dashBoard = {
		"x" : this.scene.width+(2*this.Padding),
		"y" : window.innerHeight*_headerHeight+this.Padding,
		"width" : (window.innerWidth*0.30)-this.Padding,
		"height" : this.height-2*this.Padding,
	}

	//Widgets
	this.widgets = []
	this.WidgetsPos = []
	this.numberOfWidgets = 0

	// visualizations
	// this.sceneSVG =  container.append("rect")
	// 				.attr("x", this.scene.x )
	// 				.attr("y", this.scene.y)
	// 				.attr("width", this.scene.width)
	// 				.attr("height",this.scene.height)
	// 				.style("fill", "#5D5D5D")


	this.widgetAreaSVG =  container.append("rect")
					.attr("x",this.dashBoard.x)
					.attr("y",this.dashBoard.y)
					.attr("width", this.dashBoard.width)
					.attr("height",this.dashBoard.height)
					.style("fill", "#C1BFBF")
}


//------------------------------------------------------Functions
experiment.prototype.addSVG = function(_description){

	description = _description || {
		"id" : "defaoutCircle"+01,
		"child" : "scene", 
		"type" : "circle", 
		"x" :100,
		"y" :100, 
		"r" : 10,
		"width" : 100,
		"height" : 100,
		"fill": "#69d30f",
		"click" : ""
	}

	if(description.child == "scene"){
		description.x = this.scene.x + description.x ;
		description.y = this.scene.y + description.y;
	}
	this.SVGs.push(description)
}


experiment.prototype.drawSVG = function(){

	for(var i=0;i<this.SVGs.length;i++){

		var description = this.SVGs[i];

		if(description.type == "circle"){
		this.container.append(description.type)
			.attr("id", description.id)
			.attr("cx",description.x)
			.attr("cy",description.y)	
			.attr("r",description.r)
			.attr("fill",description.fill)
			.on("click", description.click)
		}else{
					this.container.append(description.type)
			.attr("id", description.id)
			.attr("x",description.x)
			.attr("y",description.y)
			.attr("width",description.width)
			.attr("height",description.height)
			.attr("fill",description.fill)
			.on("click", description.click)

		}
	}
}

experiment.prototype.update= function(){

//update items with "update" == true,


}
