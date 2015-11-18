//-----------------------------------------------------------------------------------------------------------Mastermind Class

function Mastermind(_game,_secretSize,_dictSize,_fullDictonary,_dificulty,_secretContructor){

	var mmLogic = new logic(_secretSize,_dictSize,_fullDictonary,_dificulty,_secretContructor)
	this.dictSize = _dictSize
	this.game = _game
	this.secretSize = _secretSize
	this.dificulty = _dificulty
	this.colorsPool = [
		"#F45858",
		"#EA9950",
		"#F7D239",
		"#B1D850",
		"#287748",
		"#5DEDC0",
		"#5E94EA",
		"#5D215D",
	]

	this.rowNunBar = this.game.experiment.scene.width*0.08
	this.selectorBar = {"height" : this.game.experiment.scene.height*0.15}
	this.hintBar = {"width" : this.game.experiment.scene.width*0.2,}
	this.guessesBar = {"circles" : {"distance" : 5}}

	this.setGuessesBar()
	this.hintBar.x = this.game.experiment.scene.width-this.rowNunBar-this.guessesBar.width-this.hintBar.width
	this.setSelectorBar()

//----------------------------------------


	object={
			"id" : "hintBar",
			 "child" : "scene",
			 "type" : "rect",
			 "x" : this.guessesBar.x,
			 "y" : this.guessesBar.y,
			 "width" : this.guessesBar.width,
			 "height" : this.guessesBar.height,
			 "fill" : "#AFAFAF"
		}
	this.game.experiment.addSVG(object);


	for(var i=0; i < _dificulty; i++){//rows.
		for(var j=0; j < _secretSize; j++){//pegs

			object = {
				"id" : i+"-"+j,
		 		"child" : "scene",
		 		"type" : "circle",
			 	"x" : this.guessesBar.x + (j*this.guessesBar.columnWidth) + this.guessesBar.circles.r + this.guessesBar.circles.distance , 
		 		"y" : this.guessesBar.y + (i*this.guessesBar.rowHeight)+ this.guessesBar.circles.r+ this.guessesBar.circles.distance,
		 		"r" : this.guessesBar.circles.r,
		 		"fill": "#777777",
			}

			this.game.experiment.addSVG(object)

		}
	}

	//------------------createhintbar
	object={
		"id" : "hintBar",
		 "child" : "scene",
		 "type" : "rect",
		 "x" : this.hintBar.x,
		 "y" : 0,
		 "width" : this.hintBar.width,
		 "height" : this.game.experiment.scene.height,
		 "fill" : "#C1BFBF"
	}
	this.game.experiment.addSVG(object)


	//-------------------createNumberBar
	object={
		"id" : "numberBar",
		 "child" : "scene",
		 "type" : "rect",
		 "x" : this.game.experiment.scene.width-this.rowNunBar,
		 "y" : 0,
		 "width" : this.rowNunBar,
		 "height" : this.game.experiment.scene.height,
		 "fill" : "#C1BFBF"
	}
	this.game.experiment.addSVG(object)


	//----------------------create peg selectors 

	object={
		"id" : "numberBar",
		 "child" : "scene",
		 "type" : "rect",
		 "x" : this.selectorBar.x,
		 "y" : this.selectorBar.y,
		 "width" : this.selectorBar.width,
		 "height" : this.selectorBar.height,
		 "fill" : "#909090"
	}
	this.game.experiment.addSVG(object)

	for(var i=0; i<_dictSize; i++){

		 object = {
		 	"id" : mmLogic.dictIds[i],
		 	"child" : "scene",
		 	"type" : "circle",
		 	"x" : this.selectorBar.x + i*(this.selectorBar.width/_dictSize) + this.selectorBar.circles.r + (this.selectorBar.circles.distance/2),
		 	"y" : this.game.experiment.scene.height-this.selectorBar.height/2,
		 	"r" : this.selectorBar.circles.r,
		 	"fill": this.colorsPool[i],
		 	"click" : function(){
		 		console.log(mmLogic.selectValue(this.id))
		 		//change guess row colors
		 	}
		}
		this.game.experiment.addSVG(object)
	}

	this.game.experiment.drawSVG();
}


Mastermind.prototype.setGuessesBar = function(){
	// get max possible radius----------------------------
	var guessesMaxArea = {
		"width" : this.game.experiment.scene.width-this.hintBar.width-this.rowNunBar,
		"height" :  this.game.experiment.scene.height-this.selectorBar.height
	}
	if(guessesMaxArea.width/this.secretSize > guessesMaxArea.height/this.dificulty){
		this.guessesBar.circles.r = (guessesMaxArea.height/this.dificulty/2)-this.guessesBar.circles.distance

	}else{
		this.guessesBar.circles.r = (guessesMaxArea.width/this.secretSize/2)-this.guessesBar.circles.distance
	}

	this.guessesBar.width = this.guessesBar.circles.distance+((this.guessesBar.circles.distance+(this.guessesBar.circles.r *2))*this.secretSize)
	this.guessesBar.height = this.game.experiment.scene.height - this.selectorBar.height
	this.guessesBar.x = this.game.experiment.scene.width - this.guessesBar.width - this.rowNunBar
	this.guessesBar.y = 0
	this.guessesBar.columnWidth = this.guessesBar.circles.distance + 2*(this.guessesBar.circles.r)
	this.guessesBar.rowHeight = this.guessesBar.height/this.dificulty

}

Mastermind.prototype.setSelectorBar = function(){

	this.selectorBar.width = this.rowNunBar+this.guessesBar.width+this.hintBar.width
	this.selectorBar.circles = {"distance" : 5, "r" : this.selectorBar.width/this.dictSize}


	if(this.selectorBar.width/this.dictSize > this.selectorBar.height){
		this.selectorBar.circles.r = (this.selectorBar.height/2)-this.selectorBar.circles.distance

	}else{
		this.selectorBar.circles.r = (this.selectorBar.width/this.dictSize/2)-this.selectorBar.circles.distance
	}

	this.selectorBar.x = this.game.experiment.scene.width-this.rowNunBar-this.guessesBar.width-this.hintBar.width 
	this.selectorBar.y = this.game.experiment.scene.height-this.selectorBar.height

}


//----------------------------------------------------------------------------------------------------------Logic class

function logic(_secretSize,_dictSize,_fullDictonary,_dificulty,_secretContructor){

	this.dictIds = []
	this.secretSize = _secretSize
	this.dictSize = _dictSize

	this.LimitOfguesses = _dificulty
	this.guessesMade = 0

	this.gameOver = false;

	this.guess = []
	this.secret = []

	for (var i=0; i<_dictSize; i++){
		this.dictIds.push(_fullDictonary[i])
	}

	this.generateSecret()
}


logic.prototype.generateSecret = function(){
	
	for(var i=0;i<this.secretSize;i++){

		var valuePicker = Math.floor((Math.random() * this.dictSize) + 0);
		this.secret.push({"value": this.dictIds[valuePicker],"checked" : false })
	}

	console.log(this.secret)
	return this.secret
}

logic.prototype.selectValue = function(_pegValue){
	
	if(this.guess.length<this.secretSize){
		this.guess.push({"value":_pegValue,"checked":false})
	}else{
		console.log(this.checkGuess())
		this.guess = []
	}

	return this.guess
}

logic.prototype.checkGuess = function(){

	var hint = {
		"correctPosition" : 0,
		"correctValue" : 0,
	}

	if(this.guess.length == this.secretSize){
		hint.correctPosition = this.getCorrectPositions()
		hint.correctValue = this.getCorrectValue()
	}


	for(var i=0;i<this.secret.length; i++){
		this.secret[i].checked = false
	}
	return hint
}

logic.prototype.getCorrectValue = function(){
	var writeValue = 0

	for(var guessPosition=0; guessPosition<this.guess.length; guessPosition++){
		for(var secretPosition=0; secretPosition<this.secret.length; secretPosition++){
			if(this.guess[guessPosition].value == this.secret[secretPosition].value && this.guess[guessPosition].checked == false && this.secret[secretPosition].checked == false ){
				writeValue++
				this.guess[guessPosition].checked = true;
				this.secret[secretPosition].checked = true;
				break
			}
		}
	}

	return writeValue

}

logic.prototype.getCorrectPositions= function(){

	var writePosition = 0

	for(var guessPosition=0; guessPosition<this.guess.length; guessPosition++){
		for(var secretPosition=0; secretPosition<this.secret.length; secretPosition++){
			if(this.guess[guessPosition].value == this.secret[secretPosition].value && secretPosition == guessPosition){
				writePosition++
				this.guess[guessPosition].checked = true;
				this.secret[secretPosition].checked = true;
				break
			}
		}
	}

	return writePosition
}

//----------------------------GLOBALS

var svgContainer,circle,windowsize;
var Game1 = new game("Pedro", 10)

function setup(){

	var dictionary = [
		"red",
		"orange" , 
		"yellow" , 
		"lightgreen", 
		"darkgreen", 
		"lightblue",
		"darkblue",
		"purple",
	] 

	Game1.generateExperiment("level01")
	mmGame = new Mastermind(Game1,5,8,dictionary,12,1);
}

function update(){
	Game1.update()
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


