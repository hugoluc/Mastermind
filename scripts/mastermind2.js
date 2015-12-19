//-----------------------------------------------------------------------------------------------------------Mastermind Class

function Mastermind(_game){

	this.mobile = false;
	this.radius = 1;
	this.game = _game

	this.colors = [
		["#F45858","#CC3E3E"],
		["#E89760","#D88044"],
		["#EFD95B","#C9B449"],
		["#B0F25A","#9BC658"],
		["#5DEDC0","#6FC9A5"],
		["#5E94EA","#4C7BC1"],
		["#B260E8","#8E4CC1"],
		["#ED5DC8","#B5439D"],
	]

	this.custom = ""

}

Mastermind.prototype.grabData = function(){

	function setData(data){

		mastermind.setData(data.val())

	}

	function handleError(err){
		console.log(err.code)
	}

	console.log(this.game.uid)
	var path = "https://psymastermind.firebaseio.com/users/" + this.game.uid + "/gameCount"
	var ref = new Firebase(path);
	ref.on("value", setData,handleError);
}

Mastermind.prototype.setData = function(_data){

		this.gameCount = _data
		console.log(this.gameCount)
}

Mastermind.prototype.createLevel = function(_secretSize,_dictSize,_fullDictonary,_dificulty,_secretContructor){
	this.score = 0 // or whatever is passed in: the user's previous score
	this.game.generateExperiment("level01")
	this.game.experiment.addWidget(6,7,true)
	this.logic = new logic(this,this.game,_secretSize,_dictSize,_fullDictonary,_dificulty,_secretContructor)
	this.dictSize = _dictSize
	this.secretSize = _secretSize
	this.dificulty = _dificulty

	this.displayLevel()
	this.logic.setGuessTarget()

	this.gameCount++
	this.game.logData("gameCount",this.gameCount)

	path = "games/" + this.gameCount
	data = {
		secretSize : _secretSize,
		dictSize : _dictSize,
		dificulty : _dificulty,
	}
	this.game.logData(path,data)
}

Mastermind.prototype.init = function(){
	console.log("--")
	this.loginPage()
}

Mastermind.prototype.gameStart = function(){
	this.levelSelector()
	this.game.customScreen.display()
	this.grabData()
}

Mastermind.prototype.displayLevel = function(){

	this.drawBoard();
	console.log("-------------------------------------")
	this.drawDashboard(false);

	this.game.experiment.display()
}

Mastermind.prototype.update = function(){

	//refresh all game variables based on screen size
	this.game.refresh();

	// redraw all objects that are active
	if(this.game.experiment != undefined){

		if(this.game.experiment.getStatus()){

		this.drawBoard(true)
		this.drawDashboard(true)

		}
	}

	if(this.game.winScreen.getStatus()) this.drawWinScreen(true)
	if(this.game.looseScreen.getStatus()) this.drawLooseScreen(true)
	if(this.game.customScreen.getStatus()){

		switch(this.custom){

			case "levelSelector":
			console.log("selector")
				this.levelSelector(true)
				break

			case "loginPage":
						console.log("login")
				this.loginPage(true)
				break
		}
	}
}

//check if the function was called to update or create the graphics
Mastermind.prototype.checkUpdate = function(_update,_object,_target){

	if(_update){

		var obj = {
			"id" : _object.id,
			"child" : _object.child,
			"dashboardId" : _object.dashboardId,
			"x" : _object.x,
			"y" : _object.y,
			"x1" : _object.x1,
			"x2" : _object.x2,
			"y1" : _object.y1,
			"y2" : _object.y2,
			"rx" : _object.rx,
			"size" : _object.size,
			"ry" : _object.ry,
			"width" : _object.width,
			"height" : _object.height,
			"strokeWidth" : _object.strokeWidth,
			"r" : _object.r
		}

		this.game[_target].updateSVGs(obj)

	}else {

		this.game[_target].addSVG(_object);
	}
}

//---------------------------------------------------Board
Mastermind.prototype.drawBoard = function(update){


	//initialize board variables and define radius size
	this.getBoardRadius();

	//------------------Guess bar

		object={
				"id" : "hintBar",
				 "child" : "scene",
				 "type" : "rect",
				 "x" : this.hBar.x,
				 "y" : 0,
				 "rx" : this.radius/2,
				 "ry" : this.radius/2,
				 "width" : this.gBar.width+this.hBar.width+this.nBar.width,
				 "height" : this.gBar.height,
				 "fill" : "#F4F4F4"
			}

		this.checkUpdate(update,object,"experiment")


		for(var i=this.dificulty-1; i >= 0; i--){//rows
			for(var j=0; j < this.secretSize; j++){//pegs

				object = {
					"id" : i+"-"+j,
			 		"child" : "scene",
			 		"type" : "circle",
				 	"x" : this.hBar.x + this.hBar.width + this.radius + this.gBar.margin + this.gBar.wSpacing + j*(2*(this.radius)+this.gBar.wSpacing),
			 		"y" : this.gBar.height - this.gBar.hSpacing - this.radius - (i*(this.radius*2+2*this.gBar.hSpacing)),
			 		"strokeWidth" : this.radius*0.15,
			 		"r" : this.radius*0.9,
			 		"fill" : "#E8E6E2",
			 		"stroke" : "#E8E6E2",
			 		"click" : function(){
						event.preventDefault()
			 			var id = this.getAttribute("id")
			 			id = id.split("-")
			 			console.log("buttonid:", id[1],id[0])
			 			mastermind.logic.setGuessTarget(id[1],id[0])

			 		}
				}

				this.checkUpdate(update,object,"experiment")
			}



			console.log("------->>>", i)

			if(i != 0){
				this.checkUpdate(update,{
					"id" :  "guessLine-" + i,
					"child" : "scene",
					"type" : "line",
					"x1" : this.hBar.x,
					"x2" : this.hBar.x + this.hBar.width + this.gBar.width + this.nBar.width,
					"y1" : i * this.radius*2.5,
					"y2" : i * this.radius*2.5,
					"fill" : "#EDEDED",
					"strokeWidth" : 1.5,
				},"experiment")
			}

		}

	//------------------Selectors bar

		object={
			"id" : "selectorBar",
			 "child" : "scene",
			 "type" : "rect",
			 "x" : this.sBar.x,
			 "y" : this.sBar.y,
			 "rx" : this.radius/2,
			 "ry" : this.radius/2,
			 "width" : this.sBar.width,
			 "height" : this.sBar.height,
			 "fill" : "#F4F4F4"
		}

		this.checkUpdate(update,object,"experiment")


		for(var i=0; i<this.dictSize; i++){

			var id = this.logic.dictIds[i]

			 object = {

			 	"id" : "code-"+id,
			 	"child" : "scene",
			 	"type" : "circle",
			 	"x" : this.sBar.x + this.sBar.radius + this.sBar.margin + i*(2*this.sBar.radius+this.sBar.margin),
			 	"y" : this.sBar.y + this.sBar.height/2,
			 	"r" : this.sBar.radius,
			 	"fill": this.colors[i][0],
			 	"stroke": this.colors[i][1],
			 	"strokeWidth": this.radius*0.2,
			 	"dataValue" : this.logic.dictIds[i],
			 	"click" : function(){
					event.preventDefault()
			 		var newR = this.getAttribute("r")*0.85
			 		var radius = this.getAttribute("r")

			 		attrs = [this.getAttribute("fill"), this.getAttribute("stroke"), this.getAttribute("r")]
			 		value = this.getAttribute("data-value")
					mastermind.logic.selectValue(attrs,value)

					//game.experiment.pop()
			 	}
			}

			this.checkUpdate(update,object,"experiment")
		}

	//------------------Hint bar

		for(var i=this.dificulty-1; i>=0; i--){
			for(var j=0; j<2; j++){

			this.checkUpdate(update,{

					"id" : "hint-circle-"+j+"-"+i,
			 		"child" : "scene",
			 		"type" : "circle",
					"x" : this.hBar.x + (j*this.hBar.width/2.6) + 2*this.radius,
			 		"y" : this.gBar.height - this.gBar.hSpacing - this.radius - (i*(this.radius*2+2*this.gBar.hSpacing)),
			 		"strokeWidth" : this.radius*0.15,
			 		"r" : this.radius*0.8,
			 		"opacity" : 0,
			 		"fill" : "#E8E6E2",
			 		"stroke" : "#E8E6E2",

			},"experiment")

			object={
				"id" : "hint-"+j+"-"+i,
				 "child" : "scene",
				 "type" : "text",
				 "x" : this.hBar.x + (j*this.hBar.width/2.6) + 2*this.radius,
				 "y" : this.gBar.height - this.gBar.hSpacing - this.radius - (i*(this.radius*2+2*this.gBar.hSpacing)) + this.radius*0.3,
				 "fill" : "#383431",
				 "size" : this.radius*0.95,
				 "text" : "",
				}

			if(j==0){object.fill = "#F4EEA6"}else{object.fill = "#E2E2E2"}

			this.checkUpdate(update,object,"experiment")


			}

		}

	//--------------------- locator

		locPos = this.logic.getLocPos()

		if( locPos[0] == undefined || locPos[1] == undefined ){


			object = {

				"id" : "target-indicator",
		 		"child" : "scene",
		 		"type" : "circle",
				"x" : 1,//this.hBar.x + this.hBar.width + this.radius + this.gBar.margin + this.gBar.wSpacing + locPos[1]*(2*(this.radius)+this.gBar.wSpacing),
				"y" : 1,//this.gBar.height - this.gBar.hSpacing - this.radius - (locPos[0]*(this.radius*2+2*this.gBar.hSpacing)),
		 		"strokeWidth" : 0,
		 		"r" : 0,
		 		"fill" : "#E8E6E2",
		 		"stroke" : "#E8E6E2",
		 		"click" : {}
		 	}

		}else{

			object = {
			"id" : "target-indicator",
	 		"type" : "circle",
	 		"child" : "scene",
			"x" : this.hBar.x + this.hBar.width + this.radius + this.gBar.margin + this.gBar.wSpacing + locPos[1]*(2*(this.radius)+this.gBar.wSpacing),
			"y" : this.gBar.height - this.gBar.hSpacing - this.radius - (locPos[0]*(this.radius*2+2*this.gBar.hSpacing)),
	 		"strokeWidth" : 0,
	 		"r" : this.radius*0.7,
	 		"fill" : "#E8E6E2",
	 		"stroke" : "#E8E6E2",
	 		"click" : {}

			}


		}

		this.checkUpdate(update,object,"experiment")

	//------------------------lines
		this.checkUpdate(update,{
			"id" :  "hintline",
			"child" : "scene",
			"type" : "line",
			"x1" : this.hBar.x + this.hBar.width ,
			"x2" : this.hBar.x + this.hBar.width ,
			"y1" : 0,
			"y2" : this.gBar.height,
			"fill" : "#EDEDED",
			"strokeWidth" : 1.5,
		},"experiment")

		this.checkUpdate(update,{
			"id" :  "numeberline",
			"child" : "scene",
			"type" : "line",
			"x1" : this.hBar.x + this.gBar.width + this.hBar.width - this.radius*0.5,// + this.hBar.width ,
			"x2" : this.hBar.x + this.gBar.width + this.hBar.width - this.radius*0.5,// + this.hBar.width ,
			"y1" : 0,
			"y2" : this.gBar.height,
			"fill" : "#EDEDED",
			"strokeWidth" : 1.5,
		},"experiment")
}

Mastermind.prototype.boardPropotions = function(){

	var boardProportions = {

		radius : 1,

		circle : {
		"x" : 10,
		},

		sBar : {
		"height" : 4,
		"gap" : 0.5,
		"stroke" : 0.1,
		},

		nBar : {
		"width" : 1.5,
		},

		gBar : {
			"margin" : 0.25,
			"wSpacing" : 0.125,
			"hSpacing" : 0.25,
		},

		hBar : {
			"width" : 5.5,
			"x" : 0,
		},

	}

	boardProportions.gBar.width =  (4*boardProportions.gBar.margin) + boardProportions.gBar.wSpacing + this.secretSize*((2*boardProportions.radius)+boardProportions.gBar.wSpacing)
	boardProportions.gBar.height =  (this.dificulty*boardProportions.radius*2) + (2*this.dificulty*(boardProportions.gBar.hSpacing))

	boardProportions.gBar.x = boardProportions.hBar.width;
	boardProportions.gBar.y = 0;

	boardProportions.nBar.x = boardProportions.gBar.x+boardProportions.gBar.width;

	boardProportions.sBar.width = boardProportions.gBar.width + boardProportions.nBar.width + boardProportions.hBar.width;
	boardProportions.sBar.y = boardProportions.gBar.height + boardProportions.sBar.gap;
	boardProportions.sBar.x = 0
	boardProportions.sBar.margin = boardProportions.sBar.width*0.03


	return boardProportions
}

Mastermind.prototype.getBoardRadius = function(){

	var proportions = this.boardPropotions()

	var scene = {
		"width" : this.game.experiment.scene.width,
		"height" : this.game.experiment.scene.height
	}

	var wRadius = this.game.experiment.scene.width/(proportions.nBar.width + proportions.gBar.width + proportions.hBar.width)
	var hRadius = this.game.experiment.scene.height/(proportions.sBar.height + proportions.gBar.height + proportions.sBar.gap)


	if(wRadius < hRadius){
		this.radius = wRadius;
	}else{
		this.radius = hRadius
	}

	this.logic.setRadius(this.radius)
	this.getBoardSizes();

	var hSelectorRadius = (this.sBar.height - 2*(this.sBar.margin))/2
	var wSelectorRadius = ((this.sBar.width - (this.dictSize+1)*this.sBar.margin) / this.dictSize)/2


	if(wSelectorRadius > hSelectorRadius){
		this.sBar.radius = hSelectorRadius*0.9

	}else{
		this.sBar.radius = wSelectorRadius*0.9
	}

	this.sBar.width = this.dictSize*(this.sBar.radius*2) + (this.dictSize+1) * this.sBar.margin
	this.sBar.x =  ((this.gBar.width+this.hBar.width+this.nBar.width-this.sBar.width)/2)+this.hBar.x
}

Mastermind.prototype.getBoardSizes = function(){

	if(window.innerWidth < window.innerHeight){
		this.mobile = true;
	}else{
		this.mobile = false;
	}

	var proportions = this.boardPropotions()


	//-------------------------------

	this.circle = {
		"x" : 10,
	}

	this.sBar = {
		"height" : proportions.sBar.height*this.radius,
		"gap" : proportions.sBar.gap*this.radius,
		"stroke" : proportions.sBar.radius*0.1
	}

	this.nBar = {
		"width" : proportions.nBar.width*this.radius,
	}

	this.gBar = {
		"margin" : proportions.gBar.margin*this.radius,
		"wSpacing" : proportions.gBar.wSpacing*this.radius,
		"hSpacing" : proportions.gBar.hSpacing*this.radius,
	}

	this.hBar = {
		"width" : proportions.hBar.width*this.radius,
	}

	this.gBar.width =  proportions.gBar.width*this.radius
	this.gBar.height =  proportions.gBar.height*this.radius

	if(!this.mobile){
		this.hBar.x = (this.game.experiment.scene.width - this.gBar.width - this.hBar.width - this.nBar.width)
	}else{
		this.hBar.x = (this.game.experiment.scene.width - this.gBar.width - this.hBar.width - this.nBar.width)/2
	}
	this.nBar.x = proportions.nBar.x*this.radius
	this.gBar.x = proportions.gBar.x*this.radius
	this.gBar.y = 0

	this.sBar.width = proportions.sBar.width*this.radius
	this.sBar.y = (proportions.sBar.y*this.radius)
	this.sBar.x = 0
	this.sBar.margin = proportions.sBar.margin*this.radius

	var offset =  - this.game.experiment.scene.width + (this.gBar.width + this.hBar.width + this.nBar.width)

	offset = offset + (this.game.experiment.scene.width+this.game.experiment.dashArea.width)/2 - (this.gBar.width + this.hBar.width + this.nBar.width)/2

	if(!this.mobile){
		this.game.experiment.setOffset(offset)
	}else{
		this.game.experiment.setOffset(0)
	}
}


//---------------------------------------------------DashBoard
Mastermind.prototype.drawDashboard = function(update){

	var mobilex = 0;

	var object = {
		"id" : "checkButton",
		"child" : "dashboard",
		"dashboardId" : 1,
		"type" : "rect" ,
		"x" : 0,
		"y" : 0,
		"rx" : this.radius*0.4,
		"ry" : this.radius*0.4,
		"width" : this.radius*10,
		"height" : this.game.experiment.widgets[0].height,
		"fill" : "#22516B",
	}

	if(this.mobile) mobilex = this.game.experiment.widgets[0].width/2 - object.width/2

	object.x = mobilex

	this.checkUpdate(update,object,"experiment")

	this.checkUpdate(update,{

		"id" : "check-text",
		 "child" : "dashboard",
		 "dashboardId" : 1,
		 "type" : "text",
		 "size" : this.radius*12 + "%",
		 "x" : mobilex+this.radius*5,
		 "y" : this.radius*2.6,
		 "text" : "CHECK",
		 "fontWeight" : "bold",
		 "fill" : "#79A5B5",

	},"experiment")

	//this.checkUpdate(update,object,"experiment")
}

Mastermind.prototype.setcheckButton = function(_ready,_data){

	if(_ready){

		this.game.experiment.updateSVGs({

			"id" : "checkButton",
			"fill" : "#90BA3E",
			"dataValue" : _data,
			"click" : function(){
				event.preventDefault()
				var data = this.getAttribute("data-value")
				mastermind.logic.checkGuess(data)
			}
		})

		this.game.experiment.updateSVGs({

			"id" : "check-text",
			"fill" : "#365B19",
			"dataValue" : _data,
			"click" : function(){
				event.preventDefault()
				var data = this.getAttribute("data-value")
				mastermind.logic.checkGuess(data)
			}
		})



	}else{

		this.game.experiment.updateSVGs({

			"id" : "checkButton",
			"fill" : "#22516B",
			"dataValue" : "",
			"click" : "",
		})

		this.game.experiment.updateSVGs({

			"id" : "check-text",
			"fill" : "#79A5B5",
			"dataValue" : "",
			"click" : "",
		})

	}
}

//----------------------------------------------------Level selector

Mastermind.prototype.levelSelector = function(update){


	this.custom = "levelSelector"

	button = {
		width : this.game.customScreen.height/4,
		height : this.game.customScreen.height/10,
	}

	//create custom screen

	button.x = this.game.customScreen.width/2 - button.width/2

	//-------------------------------------------------------------------------------------------------------------normal

	button = {

		"id" : "easy",
		 "type" : "rect",
		 "x" : this.game.customScreen.width*0.5 - button.width*0.5 ,
		 "y" : this.game.customScreen.height*0.3,
		 "rx" : this.game.customScreen.height*0.01,
		 "ry" : this.game.customScreen.height*0.01,
		 "stroke": "#193749",
		 "width" : button.width,
		 "height" : button.height,
		 "fill" : "#F2CE5A",
		 "click" : function(){

			event.preventDefault()
		 	console.log(this)
		 	game.customScreen.pop()

			var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(4,5,dictionary,10,1)

		 }
	}

	this.checkUpdate(update,button,"customScreen")

	buttonText = {
		"id" : "easyText",
		 "type" : "text",
		 "x" : this.game.customScreen.width*0.5 - button.width*0.24,
		 "y" : this.game.customScreen.height*0.3 + this.game.customScreen.height*0.063,
		 "fill" : "#A58E2F",
		 "text" : "Easy",
		 "align" : "left",
		 "fontWeight" : "400",
		 "size" : this.game.customScreen.height*0.05,
		 "click" : function(){

			event.preventDefault()
		 	game.customScreen.pop()

			var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(4,5,dictionary,10,1)

		 }
	}
	this.checkUpdate(update,buttonText,"customScreen")

	//-------------------------------------------------------------------------------------------------------------normal
	button = {
		"id" : "normal",
		 "type" : "rect",
		 "x" :  this.game.customScreen.width*0.5 - button.width/2,
		 "y" : this.game.customScreen.height*0.45,
		 "rx" : this.game.customScreen.height*0.01,
		 "ry" : this.game.customScreen.height*0.01,
		 "width" : button.width,
		 "height" : button.height,
		 "fill" : "#F2CE5A",
		 "text" : "fwdsfs",
		 "stroke": "#193749",
		 "click" : function(){

			event.preventDefault()
		 	console.log(this)
		 	game.customScreen.pop()

			var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(4,5,dictionary,10,1)

		 }
	}
	this.checkUpdate(update,button,"customScreen")

	buttonText = {
		"id" : "normalText",
		 "type" : "text",
		 "x" : this.game.customScreen.width*0.5 - button.width*0.35,
		 "y" :  this.game.customScreen.height*0.45 + this.game.customScreen.height*0.06 ,
		 "fill" : "#A58E2F",
		 "text" : "Normal",
		 "size" : this.game.customScreen.height*0.05,
		 "fontWeight" : "400",
		 "align" : "left",
		 "click" : function(){
		 	event.preventDefault()
		 	game.customScreen.pop()
			var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(5,6,dictionary,10,1)

		 }

	}
	this.checkUpdate(update,buttonText,"customScreen")


	//-----------------------------------------------------------------------------------------------------------------------hard
	button = {

		"id" : "hard",
		 "type" : "rect",
		 "x" :  this.game.customScreen.width*0.5 - button.width/2,
		 "y" : this.game.customScreen.height*0.6,
		 "rx" : this.game.customScreen.height*0.01,
		 "ry" : this.game.customScreen.height*0.01,
		 "width" : button.width,
		 "height" : button.height,
		 "fill" : "#F2CE5A",
		 "click" : function(){

		 	game.customScreen.pop()

			var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(5,7,dictionary,10,1)

		 }
	}

	this.checkUpdate(update,button,"customScreen")

	buttonText = {
		"id" : "hardText",
		 "type" : "text",
		 "x" : this.game.customScreen.width*0.5 - button.width*0.25,
		 "y" : this.game.customScreen.height*0.6 + this.game.customScreen.height*0.06,
		 "fill" : "#A58E2F",
		 "text" : "Hard",
		 "align" : "left",
		 "fontWeight" : "400",
		 "size" : this.game.customScreen.height*0.05,
		 "click" : function(){
		 	event.preventDefault()
		 	game.customScreen.pop()
			var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(5,7,dictionary,10,1)

		 }

	}
	this.checkUpdate(update,buttonText,"customScreen")
}

//----------------------------------------------------Win Screen

Mastermind.prototype.displayWinScreen = function(){

	this.drawWinScreen(false)

	console.log("display!")
	this.game.winScreen.display()
}

Mastermind.prototype.drawWinScreen = function(update){

	popUpWidth = this.radius * 16
	popUpHeigtht = this.radius * 17


	this.game.winScreen.setPopupSize(popUpWidth,popUpHeigtht)

	this.checkUpdate(update,{

		"id" : "winScreen-PopUp",
		 "child" : "winScreen",
		 "type" : "rect",
		 "x" : 0,
		 "y" : 0,
		 "rx" : this.radius/2,
		 "ry" : this.radius/2,
		 "width" : this.game.winScreen.width,
		 "height" : this.game.winScreen.height,
		 "fill" : "#F4F4F4",
	},"winScreen")


	this.checkUpdate(update,{

		"id" : "winScreen-back-button",
		 "child" : "winScreen",
		 "type" : "rect",
		 "x" : this.radius,
		 "y" : this.radius*13,
		 "rx" : this.radius/2,
		 "ry" : this.radius/2,
		 "width" : this.radius*6,
		 "height" : this.radius*3,
		 "fill" : "#193749",
		 "click" : function(){
			event.preventDefault()
		 	console.log("win")
		 	game.winScreen.pop()
		 	console.log("experiment")
		 	game.experiment.pop()
		 	console.log("init")
		 	mastermind.gameStart()

		 }
	},"winScreen")

	this.checkUpdate(update,{

		"id" : "winScreen-back-button-text",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*8.5 + "%",
		 "x" : this.radius*3.92,
		 "y" : this.radius*15,
		 "text" : "BACK",
		 "fontWeight" : "bold",
		 "fill" : "#6D9BB2",
		 "click" : function(){
			event.preventDefault()
		 	console.log("win")
		 	game.winScreen.pop()
		 	console.log("experiment")
		 	game.experiment.pop()
		 	console.log("init")
		 	mastermind.gameStart()

		 }
	},"winScreen")

	this.checkUpdate(update,{

		"id" : "winScreen-replay-button",
		 "child" : "winScreen",
		 "type" : "rect",
		 "x" : this.radius*8,
		 "y" : this.radius*13,
		 "rx" : this.radius/2,
		 "ry" : this.radius/2,
		 "width" : this.radius*7,
		 "height" : this.radius*3,
		 "fill" : "#90BA3E",
		 "click" : function(){
			event.preventDefault()
		 	console.log("--------------")
		 	console.log("win")
		 	game.winScreen.pop()
		 	console.log("experiment")
		 	game.experiment.pop()

		 	var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(mastermind.secretSize,mastermind.dictSize,dictionary,10,1)

		 }
	},"winScreen")

	this.checkUpdate(update,{

		"id" : "winScreen-replay-button-text",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*8.5 + "%",
		 "x" : this.radius*11.5,
		 "y" : this.radius*15,
		 "text" : "REPLAY",
		 "fontWeight" : "bold",
		 "fill" : "#365B19",
		 "click" : function(){
			event.preventDefault()
		 	console.log("--------------")
		 	console.log("win")
		 	game.winScreen.pop()
		 	console.log("experiment")
		 	game.experiment.pop()

		 	var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(mastermind.secretSize,mastermind.dictSize,dictionary,10,1)

		 }
	},"winScreen")


	//---------------------------tittle
	this.checkUpdate(update,{

		"id" : "winScreen-message",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*7 + "%",
		 "x" : this.game.winScreen.width/2,
		 "y" : this.radius*2,
		 "text" : "YOU BROKE THE CODE!",
		 "fontWeight" : "bold",
		 "fill" : "#193749",
	},"winScreen")

	this.checkUpdate(update,{
		"id" : "winScreen-message-line",
		 "child" : "winScreen",
		 "type" : "line",
		 "x1" : this.radius*3,
		 "x2" : this.game.winScreen.width-this.radius*3,
		 "y1" : this.radius*2.6,
		 "y2" : this.radius*2.6,
		 "fill" : "#193749",
	},"winScreen")

	this.checkUpdate(update,{
		"id" : "winScreen-message-line2",
		 "child" : "winScreen",
		 "type" : "line",
		 "x1" : this.radius*1.5,
		 "x2" : this.game.winScreen.width-this.radius*1.5,
		 "y1" : this.radius*12,
		 "y2" : this.radius*12,
		 "fill" : "#193749",
	},"winScreen")

	//---------------------------score
	this.checkUpdate(update,{
		"id" : "winScreen-score",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*7 + "%",
		 "x" : this.game.winScreen.width/2,
		 "y" : this.radius*4.5,
		 "text" : "score:",
		 "fontWeight" : "normal",
		 "fill" : "#CCBD1D",
	},"winScreen")

	this.checkUpdate(update,{
		"id" : "winScreen-score-number",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*18 + "%",
		 "x" : this.game.winScreen.width/2,
		 "y" : this.radius*8,
		 "text" : this.score,
		 "fontWeight" : "bold",
		 "fill" : "#CCBD1D",
	},"winScreen")
}

//----------------------------------------------------Win Screen

Mastermind.prototype.displayLooseScreen = function(){

	this.drawLooseScreen(false)

	console.log("display!")
	this.game.looseScreen.display()
}

Mastermind.prototype.drawLooseScreen = function(update){

	popUpWidth = this.radius * 16
	popUpHeigtht = this.radius * 17


	this.game.winScreen.setPopupSize(popUpWidth,popUpHeigtht)

	this.checkUpdate(update,{

		"id" : "winScreen-PopUp",
		 "child" : "winScreen",
		 "type" : "rect",
		 "x" : 0,
		 "y" : 0,
		 "rx" : this.radius/2,
		 "ry" : this.radius/2,
		 "width" : this.game.winScreen.width,
		 "height" : this.game.winScreen.height,
		 "fill" : "#F4F4F4",
	},"winScreen")


	this.checkUpdate(update,{

		"id" : "winScreen-back-button",
		 "child" : "winScreen",
		 "type" : "rect",
		 "x" : this.radius,
		 "y" : this.radius*13,
		 "rx" : this.radius/2,
		 "ry" : this.radius/2,
		 "width" : this.radius*6,
		 "height" : this.radius*3,
		 "fill" : "#193749",
		 "click" : function(){
			event.preventDefault()
		 	console.log("win")
		 	game.winScreen.pop()
		 	console.log("experiment")
		 	game.experiment.pop()
		 	console.log("init")
		 	mastermind.gameStart()

		 }
	},"winScreen")

	this.checkUpdate(update,{

		"id" : "winScreen-back-button-text",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*8.5 + "%",
		 "x" : this.radius*3.92,
		 "y" : this.radius*15,
		 "text" : "BACK",
		 "fontWeight" : "bold",
		 "fill" : "#6D9BB2",
		 "click" : function(){
			event.preventDefault()
		 	console.log("win")
		 	game.winScreen.pop()
		 	console.log("experiment")
		 	game.experiment.pop()
		 	console.log("init")
		 	mastermind.gameStart()

		 }
	},"winScreen")

	this.checkUpdate(update,{

		"id" : "winScreen-replay-button",
		 "child" : "winScreen",
		 "type" : "rect",
		 "x" : this.radius*8,
		 "y" : this.radius*13,
		 "rx" : this.radius/2,
		 "ry" : this.radius/2,
		 "width" : this.radius*7,
		 "height" : this.radius*3,
		 "fill" : "#90BA3E",
		 "click" : function(){
			event.preventDefault()
		 	console.log("--------------")
		 	console.log("win")
		 	game.winScreen.pop()
		 	console.log("experiment")
		 	game.experiment.pop()

		 	var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(mastermind.secretSize,mastermind.dictSize,dictionary,10,1)

		 }
	},"winScreen")

	this.checkUpdate(update,{

		"id" : "winScreen-replay-button-text",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*8.5 + "%",
		 "x" : this.radius*11.5,
		 "y" : this.radius*15,
		 "text" : "REPLAY",
		 "fontWeight" : "bold",
		 "fill" : "#365B19",
		 "click" : function(){
			event.preventDefault()
		 	console.log("--------------")
		 	console.log("win")
		 	game.winScreen.pop()
		 	console.log("experiment")
		 	game.experiment.pop()

		 	var dictionary = [1,2,3,4,5,6,7,8]
		 	mastermind.createLevel(mastermind.secretSize,mastermind.dictSize,dictionary,10,1)

		 }
	},"winScreen")


	//---------------------------tittle
	this.checkUpdate(update,{

		"id" : "winScreen-message",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*7 + "%",
		 "x" : this.game.winScreen.width/2,
		 "y" : this.radius*2,
		 "text" : "YOU LOOSE",
		 "fontWeight" : "bold",
		 "fill" : "#193749",
	},"winScreen")

	this.checkUpdate(update,{
		"id" : "winScreen-message-line",
		 "child" : "winScreen",
		 "type" : "line",
		 "x1" : this.radius*3,
		 "x2" : this.game.winScreen.width-this.radius*3,
		 "y1" : this.radius*2.6,
		 "y2" : this.radius*2.6,
		 "fill" : "#193749",
	},"winScreen")

	this.checkUpdate(update,{
		"id" : "winScreen-message-line2",
		 "child" : "winScreen",
		 "type" : "line",
		 "x1" : this.radius*1.5,
		 "x2" : this.game.winScreen.width-this.radius*1.5,
		 "y1" : this.radius*12,
		 "y2" : this.radius*12,
		 "fill" : "#193749",
	},"winScreen")

	//---------------------------score
	this.checkUpdate(update,{
		"id" : "winScreen-score",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*7 + "%",
		 "x" : this.game.winScreen.width/2,
		 "y" : this.radius*4.5,
		 "text" : "score:",
		 "fontWeight" : "normal",
		 "fill" : "#CCBD1D",
	},"winScreen")

	this.checkUpdate(update,{
		"id" : "winScreen-score-number",
		 "child" : "winScreen",
		 "type" : "text",
		 "size" : this.radius*18 + "%",
		 "x" : this.game.winScreen.width/2,
		 "y" : this.radius*8,
		 "text" : "1,234",
		 "fontWeight" : "bold",
		 "fill" : "#CCBD1D",
	},"winScreen")
}

//----------------------------------------------------login
Mastermind.prototype.loginpageProportions = function(){

	proportions = {
		area : { height : 14, width : 9,},
		inputbox : {height : 1, width : 8,}
	}

	return proportions
}

Mastermind.prototype.loginPage = function(update){

	this.custom = "loginPage"

	proportions = this.loginpageProportions()
	referece = this.game.customScreen.height/proportions.area.height

	proportions.area.x = this.game.customScreen.width/2 - (proportions.area.width/2)*referece
	proportions.area.y = this.game.customScreen.y + referece*2

	//create DOm elements

	if(!update){
		console.log("test")

		div = document.createElement("div")
		div.style.position = "absolute"
		div.id = "aouth"


		emailbox = document.createElement("input")
		emailbox.style.position = "absolute"
		emailbox.type = "text"
		emailbox.id = "emailbox"
		div.appendChild(emailbox)

		passwordBox = document.createElement("input")
		passwordBox.style.position = "absolute"
		passwordBox.type = "password"
		passwordBox.id = "passwordBox"
		div.appendChild(passwordBox)

		svgContainer = document.getElementById("conteiner")
		console.log(svgContainer)

		document.body.insertBefore(div, svgContainer);
	}

	emailBox = document.getElementById("emailbox")
	emailBox.style.color = "#323232"
	emailBox.style.left =  proportions.area.x+referece*0.5;
	emailBox.style.top =  proportions.area.y + referece*2.8;
	emailBox.style.height =  proportions.inputbox.height * referece;
	emailBox.style.width = proportions.inputbox.width * referece
	emailBox.style.fontSize = referece*0.4
	emailBox.style.fontFamily = "Roboto"
	emailBox.style.fontWeight = "500"
	emailBox.style.borderRadius = (referece*0.12)+"px"

	this.checkUpdate(update, {

		"id" : "email-Title",
		"child" : "customScreen",
		"type" : "text",
		"x" : proportions.area.x+referece/2,
		"y" : proportions.area.y + referece*2.5,
		"text" : "E-mail:",
		"fontWeight" : "bold",
		"fill" : "#ffffff",
		"align" : "left",
		"size" : referece*0.6,

	},"customScreen")

	//imput box1
	passwordBox = document.getElementById("passwordBox")
	passwordBox.style.color = "#323232"
	passwordBox.style.left =  proportions.area.x+referece*0.5;
	passwordBox.style.top =  proportions.area.y + referece*5.3;
	passwordBox.style.height =  proportions.inputbox.height * referece;
	passwordBox.style.width = proportions.inputbox.width * referece
	passwordBox.style.fontSize = referece*0.4
	passwordBox.style.fontFamily = "Roboto"
	passwordBox.style.fontWeight = "500"
	passwordBox.style.borderRadius = (referece*0.12)+"px"

	this.checkUpdate(update, {

		"id" : "password-Title",
		"child" : "customScreen",
		"type" : "text",
		"x" : proportions.area.x+referece/2,
		"y" :  proportions.area.y + referece*5,
		"text" : "Password:",
		"fontWeight" : "bold",
		"fill" : "#ffffff",
		"align" : "left",
		"size" : referece*0.6,

	},"customScreen")

	// register button
	var register = function(){

		event.preventDefault()
		var email = document.getElementById("emailbox").value
		var password =  document.getElementById("passwordBox").value

		game.register(email,password)
	}

	var login = function(){
		event.preventDefault()
		var email = document.getElementById("emailbox")
		console.log(email)
		var password =  document.getElementById("passwordBox")

		game.login(email.value,password.value)

	}

	//register button
	this.checkUpdate(update, {
		"id" : "register-button",
		"child" : "customScreen",
		"type" : "rect",
		"x" : proportions.area.x+referece/2,
		"y" :  proportions.area.y + referece*6.8,
		"rx" : referece*0.1,
		"ry" : referece*0.1,
		"fill" : "#22516b",
		"width" : referece*3,
		"height" : referece*1.5,
		"click" : register,
		"hover" : function(){

			var button = d3.select(this).style({color:"#265B72"})

		}

	},"customScreen")

	this.checkUpdate(update, {
		"id" : "register-text",
		"child" : "customScreen",
		"type" : "text",
		"x" : proportions.area.x+referece*0.96,
		"y" :  proportions.area.y + referece*7.7,
		"text" : "register",
		"fontWeight" : "bold",
		"fill" : "#79A5B5",
		"align" : "left",
		"size" : referece*0.6,
		"click" : register,

	},"customScreen")


	//login button
	this.checkUpdate(update, {
		"id" : "login-button",
		"child" : "customScreen",
		"type" : "rect",
		"x" : proportions.area.x+referece*4,
		"y" :  proportions.area.y + referece*6.8,
		"rx" : referece*0.1,
		"ry" : referece*0.1,
		"fill" : "#90BA3E",
		"width" : referece*4.5,
		"height" : referece*1.5,
		"click" : login

	},"customScreen")

	this.checkUpdate(update, {
		"id" : "login-text",
		"child" : "customScreen",
		"type" : "text",
		"x" : proportions.area.x+referece*5.5,
		"y" :  proportions.area.y + referece*7.7,
		"text" : "login",
		"fontWeight" : "bold",
		"fill" : "#365B19",
		"align" : "left",
		"size" : referece*0.6,
		"click" : login,

	},"customScreen")



	this.game.customScreen.display()
}

//----------------------------------------------------------------------------------------------------------Logic class

	function logic(_mastermind,_game,_secretSize,_dictSize,_fullDictonary,_dificulty,_secretContructor){

		var internalSecret = 10

		this.setSecret = function(_secret){
			internalSecret = _secret
		}

		this.getSecret = function(){
			return internalSecret
		}

		this.dificulty = _dificulty
		this.radius
		this.game = _game
		this.dictIds = []
		this.secretSize = _secretSize
		this.dictSize = _dictSize
		this.mastermind = _mastermind
		this.lastInteraction

		this.LimitOfguesses = _dificulty
		this.valuesSelected = 0
		this.guessesMade = 0

		this.gameOver = false;

		this.guess = []
		this.secret = []

		this.guessTarget = {
			"row" : undefined,
			"column" : undefined,
		};

		this.lastTarget = {
			"row" : undefined,
			"column" : undefined,
		};

		for (var i=0; i<_dictSize; i++){
			this.dictIds.push(_fullDictonary[i])
		}

		this.generateSecret()
		console.log(this.secret)
	}

	logic.prototype.setRadius = function(_r){

		this.radius = _r
	}

	logic.prototype.getLocPos = function(){

		return [this.guessTarget.row,this.guessTarget.column]
	}

	logic.prototype.setGuessTarget = function(_col,_row){

		if(_col === true){

			console.log(_col)
			this.lastTarget.row = this.guessTarget.row
			this.lastTarget.column = this.guessTarget.column

			obj = {

				"id" : "target-indicator",
				"r" : 0,
				"click" : [],
			}

			game.experiment.updateSVGs(obj)


			return
		}

		if(_row != undefined && _col != undefined ){

			if(_row != this.guessTarget.row || _col != this.guessTarget.column){
				this.lastTarget.row = this.guessTarget.row
				this.lastTarget.column = this.guessTarget.column
			}

		}else{
			this.lastTarget.row = this.guessTarget.row
			this.lastTarget.column = this.guessTarget.column
		}



		if(_row != undefined && _col != undefined ){

			var row = parseInt(_row)

			 if( row != this.guessesMade ){
			 	return
			 }

			this.guessTarget.column = _col
			this.guessTarget.row =  _row

		}else if(this.guess.length > 0){


			for (var i = 0; i<this.guess.length+1; i++){

				if(this.guess[i] == undefined){

					this.guessTarget.column = i
			 		this.guessTarget.row =  Math.floor(this.valuesSelected/this.secretSize)

					break
				}

			}

		} else{

			this.guessTarget.column = 0
			this.guessTarget.row = Math.floor(this.valuesSelected/this.secretSize)

		}

		if (this.guess[_col] != undefined) {


			this.mastermind.setcheckButton(false)

		 	this.guess[_col] = undefined
		 	this.valuesSelected--


		 }

		// console.log(" last target is: ", this.lastTarget)
		// console.log("target is: ", this.guessTarget)
		this.changeGuessAparance(this.guessTarget.row,this.guessTarget.column)
	}

	logic.prototype.changeGuessAparance = function(_row,_col){

		var obj= {

			"id" : this.guessTarget.row + "-" + this.guessTarget.column,
			"fill" :  "#E8E6E2",
			"stroke" : "#E8E6E2",
		}

		game.experiment.updateSVGs(obj)


		// console.log(game.experiment.SVG["target-indicator"])
		target = game.experiment.SVG[this.guessTarget.row + "-" + this.guessTarget.column]

		obj = {

			"id" : "target-indicator",
			"fill" :  "#C4C3C2",
			"stroke" : "#C4C3C2",
			"r" : this.radius*0.7,
			"x" : target.x,
			"y" : target.y,
			"click" : target.click,
		}

		game.experiment.updateSVGs(obj)

		// console.log("target:", target)
		// console.log(document.getElementById("target-indicator"))

		// color target
		if(this.lastTarget.row != undefined && this.guess[this.lastTarget.column] == undefined && this.lastTarget.row == this.guessTarget.row){

			var obj= {
				"id" : this.lastTarget.row + "-" + this.lastTarget.column,
				"fill" :  "#E8E6E2",
				"stroke" : "#E8E6E2",
			}
			game.experiment.updateSVGs(obj)


		}
	}

	logic.prototype.generateSecret = function(){

		for(var i=0;i<this.secretSize;i++){

			var valuePicker = Math.floor((Math.random() * this.dictSize) + 0);
			this.secret.push({"value": this.dictIds[valuePicker],"checked" : false })
		}

		this.setSecret(this.secret)

		return this.secret
	}

	logic.prototype.selectValue = function(_pegData,_pegValue){

		if(!this.checkGuessFinished()){

			var row =  Math.floor(this.valuesSelected/this.secretSize)
			this.valuesSelected++

			//var target = document.getElementById(this.guestTarget.row + "-" + this.guestTarget.column)
			var target = document.getElementById(this.guessTarget.row + "-" + this.guessTarget.column)

			var radius = target.getAttribute("r")

			var obj= {

				"id" : this.guessTarget.row + "-" + this.guessTarget.column,
				"fill" :  _pegData[0],
				"stroke" : _pegData[1],
				"strokeWidth": this.radius*0.15,
				"r" : this.radius*0.9

			}

			game.experiment.updateSVGs(obj)

			//-------------------------------------------------------------------
			this.guess[this.guessTarget.column] = {"value":_pegValue,"checked":false}


				if(this.checkGuessFinished()){

					this.setGuessTarget(_final=true)
					this.mastermind.setcheckButton(true,row)

				}else{

					this.setGuessTarget()

				}

			}

		return this.guess
	}

	logic.prototype.checkGuessFinished = function(){

		for(var i=0;i<this.secretSize; i++){

			if(this.guess[i] == undefined){
				return false;
			}
		}

		return true
	}

	logic.prototype.checkGuess = function(_row){


		var path = "guesses/game_" + this.mastermind.gameCount + "/" + _row

		//logdaga
		data = []

		for (var i=0; i<this.guess.length; i++){
			data.push(this.guess[i].value)

		}

		this.game.logData(path,data)

		var secret = this.getSecret()

		var hint = {
			"correctPosition" : 0,
			"correctValue" : 0,
		}

		if(this.checkGuessFinished()){

			hint.correctPosition = this.getCorrectPositions(secret)
			hint.correctValue = this.getCorrectValue(secret)


			for(var i=0;i<secret.length; i++){
				secret[i].checked = false
			}

			if( hint.correctPosition > 0){

				this.game.experiment.updateSVGs({
					"id" : "hint-" + 0 + "-" + _row,
					"type" : "text",
					"child" : "experiment",
					"text" : hint.correctPosition,

				})


				this.game.experiment.updateSVGs({
					"id" : "hint-circle-0-" + _row,
					"type" : "circle",
					"child" : "experiment",
					"fill" : "#CCBD1D",
					"stroke" : "#AFA305",
					"opacity" : 100,
					"r" : this.radius*0.8,
				})
			}

			if( hint.correctValue > 0){

				this.game.experiment.updateSVGs({
					"id" : "hint-" + 1 + "-" + _row,
					"type" : "text",
					"child" : "experiment",
					"text" : hint.correctValue,
				})

				this.game.experiment.updateSVGs({
					"id" : "hint-circle-1-" + _row,
					"type" : "circle",
					"child" : "experiment",
					"fill" : "#A5A5A5",
					"stroke" : "#919190",
					"opacity" : 100,
					"r" : this.radius*0.8,
				})
			}
		}

		if(hint.correctPosition == this.secretSize){
			var gameScore = (10-this.guessesMade)*(this.secretSize+this.dictSize)*10;
			this.mastermind.score += gameScore;
			this.mastermind.displayWinScreen(); //
			console.log("won with score: "+gameScore);
			return

		} else if (_row == this.dificulty-1){

			this.mastermind.displayLooseScreen()
			console.log("youlose")
			return
		}

		this.guess = []
		this.setGuessTarget()
		this.guessesMade++
		this.mastermind.setcheckButton(false)
		return hint
	}

	logic.prototype.getCorrectValue = function(secret){
		var writeValue = 0

		for(var guessPosition=0; guessPosition<this.guess.length; guessPosition++){
			for(var secretPosition=0; secretPosition<secret.length; secretPosition++){
				if(this.guess[guessPosition].value == secret[secretPosition].value && this.guess[guessPosition].checked == false && secret[secretPosition].checked == false ){
					writeValue++
					this.guess[guessPosition].checked = true;
					secret[secretPosition].checked = true;
					break
				}
			}
		}

		return writeValue
	}

	logic.prototype.getCorrectPositions= function(secret){

		var writePosition = 0

		for(var guessPosition = 0; guessPosition < this.guess.length; guessPosition++){
			for(var secretPosition=0; secretPosition < secret.length; secretPosition++){
				if(this.guess[guessPosition].value == secret[secretPosition].value && secretPosition == guessPosition){
					writePosition++
					this.guess[guessPosition].checked = true;
					secret[secretPosition].checked = true;
					break
				}
			}
		}

		return writePosition
	}

//----------------------------------------------------------------------------------------------------------GLOBALS

	var svgContainer,circle,windowsize;
	var game = new Game("Pedro", 10);
	var mastermind = new Mastermind(game);
	var fireBase = new Firebase("https://psymastermind.firebaseio.com/")

	window.addEventListener("resize", function(){

		console.log("00")
		mastermind.update();

	});

	function checkPrivate(){
		try {
		  // try to use localStorage
		  localStorage.test = 2;
		} catch (e) {
		  // there was an error so...
		  alert('You are in Privacy Mode\nPlease click on the button on the bottom right corner, deactivate Private Mode and then reload the page.\n');
		}
	}

	window.addEventListener("load", checkPrivate)


	WebFontConfig = {
    	google: { families: [ 'Roboto:100,200,300,400,500,00,700,:latin' ] }
  	};

  	(function() {
	    var wf = document.createElement('script');
	    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
	      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	    wf.type = 'text/javascript';
	    wf.async = 'true';
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(wf, s);
  	})();



fireBase.onAuth(function(authData){
	console.log("--")
	if(authData){
		game.setUserId(authData.uid)
		game.customScreen.pop()
		var body = document.getElementById("body")
		aouth = document.getElementById("aouth")
		if(aouth != undefined) body.removeChild(aouth)
		mastermind.gameStart()

	}else{

		if(game.experiment.getStatus()) game.experiment.pop()
		if(game.customScreen.getStatus()) game.customScreen.pop()
		mastermind.init()
	}

});
