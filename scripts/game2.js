//-----------------------------------------------------------------------------------------------------------------GAME CLASS

function Game(playerName){

	//Header menu
	this.headerHeigth = 0.08

	this.screenWidth = window.innerWidth;
	this.scrennHeight = window.innerHeight;

	// svgContainer
	this.Container = d3.select("body").append("svg").attr("width", this.screenWidth).attr("height", this.scrennHeight).attr("id", "conteiner");

	this.player = playerName || ""
	this.winScreen = new winScreen(this.Container,this.headerHeigth);
	this.looseScreen = new winScreen(this.Container,this.headerHeigth);
	this.customScreen = new customScreen(this.Container,this.headerHeigth);
	this.menu = new headerMenu(this.Container,this.headerHeigth);
	this.experiment = new experiment(this.Container,this.headerHeigth);

	this.menu.display()

}

Game.prototype.setUserId = function(_id){
	this.uid = _id
}

Game.prototype.update = function(){


	// chenge container size not working!
	this.screenWidth = window.innerWidth;
	this.scrennHeight = window.innerHeight;
	this.Container.attr("width", this.screenWidth).attr("height", this.scrennHeight);
	//this.experiment.drawSVG()
}

Game.prototype.refresh = function(){

	game.update()
	if(this.experiment == undefined){

	} else{
		this.experiment.init()
	}
	this.menu.init()
	this.menu.display()
	this.customScreen.init()
	this.winScreen.init()
	this.looseScreen.init()
}

Game.prototype.login = function(email,password,callback){

	var loggedIn = false
	var userId;

	function handler(error, authData){
		if (error) {
			console.log("Login Failed!", error);
			loggedIn = false
		} else {
			console.log("sucess!")
		}
	}

	console.log(userId)

	fireBase.authWithPassword({
	  email    : email,
	  password : password,
	},handler);
}

Game.prototype.logData = function(_path,_data){

	fireBase.child("users/" + this.uid + "/" + _path).set(_data);	
}

Game.prototype.pushData = function(_path,_data){

	fireBase.child("users/" + this.uid + "/" + _path).push(_data);		

}

Game.prototype.register = function(email,password){

	fireBase.createUser(

			// argument 1
			{
			  email    : email,
			  password : password,
			}, 

			// argument 2
			function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			 }
	});
}

//----------------------------------------------------------------Area Class

	function Area(container){
		this.x = 0;
		this.y = 0;
	 	this.container = container
	 	this.SVG = {}
	 	this.offset = {
	 		"x" : 0,
	 		"y" : 0,
	 	}
	 	this.active = false;
	 	this.init()
	}

	Area.prototype.getStatus = function(){
		return this.active;
	}


	Area.prototype.adjustPosition = function(_description) {


		if(_description.child != undefined){

			if(_description.child == "scene"){
			
				if(_description.x != undefined)_description.x = _description.x + this.scene.x + this.offset.x
				if(_description.y != undefined)_description.y = _description.y + this.scene.y + this.offset.y
				if(_description.x1 != undefined)_description.x1 = _description.x1 + this.scene.x + this.offset.x
				if(_description.y1 != undefined)_description.y1 = _description.y1 + this.scene.y + this.offset.y
				if(_description.x2 != undefined)_description.x2 = _description.x2 + this.scene.x + this.offset.x
				if(_description.y2 != undefined)_description.y2 = _description.y2 + this.scene.y + this.offset.y
			
			} else if(_description.child == "dashboard"){


				if(_description.x != undefined) _description.x = _description.x + this.widgets[_description.dashboardId-1].x + this.offset.x
				if(_description.y != undefined)_description.y = _description.y + this.widgets[_description.dashboardId-1].y + this.offset.y
				if(_description.x1 != undefined)_description.x1 = _description.x1 + this.scene.x + this.offset.x
				if(_description.y2 != undefined)_description.y1 = _description.y1 + this.scene.y + this.offset.y
				if(_description.x1 != undefined)_description.x2 = _description.x2 + this.scene.x + this.offset.x
				if(_description.y2 != undefined)_description.y2 = _description.y2 + this.scene.y + this.offset.y


			}else{

				if(_description.x != undefined) _description.x = _description.x + this.x + this.offset.x
				if(_description.y != undefined) _description.y = _description.y + this.y + this.offset.y
				if(_description.x1 != undefined) _description.x1 = _description.x1 + this.x + this.offset.x
				if(_description.y1 != undefined) _description.y1 = _description.y1 + this.y + this.offset.y
				if(_description.x2 != undefined) _description.x2 = _description.x2 + this.x + this.offset.x
				if(_description.y2 != undefined) _description.y2 = _description.y2 + this.y + this.offset.y

			}

		}

		// adsjust x and y based on child
		return _description
	}

	Area.prototype.setOffset = function(_x,_y){

		if(_x != undefined) {this.offset.x = _x}
		if(_y != undefined) {this.offset.y = _y}
	}

	Area.prototype.display = function() {

		this.active = true;

		this.init()
		this.updateSVGs("all")
	}

	Area.prototype.init = function(){
		this.width = window.innerWidth
		this.height = window.innerHeight - (window.innerHeight*this.header)
	}

	Area.prototype.addSVG = function(description){

		this.container.append(description.type).attr("id", description.id)		
		description = this.adjustPosition(description)
		this.SVG[description.id] = description 
	}

	Area.prototype.updateSVGs = function(_description){ 


		var changeSize,svg,description
	 	var all = false
		var key = Object.keys(this.SVG)

		//ERROR
		if(_description == undefined){
			throw "No description provided!"
		}

		//--------------------------------------------adjust x and y funciton
		_description = this.adjustPosition(_description)

		if(_description == "all" || _description == "All"){

			// run for loop
			changeSize = Object.keys(this.SVG).length
			all = true;

		} else if(_description.id != undefined){

			if(this.SVG[_description.id] == undefined) throw "ID mismatch! Id:" + _description.id + " not found!" 

			//run only on target
			for(attrname in _description){

				this.SVG[_description.id][attrname] = _description[attrname]					

			}

			_description = this.SVG[_description.id]
			changeSize = 1


		} else{
			throw "ERROR: Object to update not found! Try 'All' for updating all objects,or pass an 'id' of the object to be chenaged in the parameter object" 
		}


		for(var i=0;i<changeSize;i++){

			if(all) {
				svg = d3.select(document.getElementById(this.SVG[key[i]].id))
				description = this.SVG[key[i]]
			} else{
				svg = d3.select(document.getElementById(_description.id))
				description = _description
			}


			svg.attr("fill",description.fill)
				.attr("stroke", description.stroke)
				.attr("stroke-width", description.strokeWidth)
				.attr("data-value", description.dataValue)
				.attr("opacity", description.opacity)

				.on("touchstart", description.click)
				.on("click", description.click)
				.on("mouseover", description.over)
				.on("mouseout", description.out)

			 switch(description.type){

			 	case "circle" : 
		 			svg
		 			.attr("r", description.r)
		 			.attr("cx", description.x)
		 			.attr("cy", description.y)

		 			break;

		 		case "rect":
		 			svg
		 			.attr("width", description.width)
		 			.attr("height", description.height)
		 			.attr("x", description.x)
		 			.attr("y", description.y)
		 			.attr("rx", description.r || 0)		
					.attr("ry", description.ry || 0)
		 			break;

		 		case "text":

		 			svg
		 			.attr("x",description.x)
					.attr("y",description.y)
					.text(description.text)
					.attr("font-family", "Roboto")
					.attr("font-weight", description.fontWeight)
					.attr("font-size", description.size)
					.attr("text-anchor", description.align || "middle")
		 			break;
		 		
		 		case "line":
		 			svg
		 			.style("stroke",description.fill)
					.attr("x1",description.x1)
					.attr("x2",description.x2)
					.attr("y1",description.y1)
					.attr("y2",description.y2)
		 			break
			}
		 }
	}

	Area.prototype.removeSVG = function(_id){


		var conteiner = document.getElementById("conteiner")
		var svg = document.getElementById(_id)

		if(svg != null){
			
			conteiner.removeChild(svg)	
		
		}
	}

	Area.prototype.pop = function(){

	 	if(Object.keys(this.SVG).length > 0){
			
			var conteiner = document.getElementById("conteiner")
			
			for(attributes in this.SVG){		

				var id = this.SVG[attributes].id
				var svg = document.getElementById(id)
				conteiner.removeChild(svg)
			}

			this.SVG = []
		}

		this.active = false
	}

//---------------------------------winScreen

function winScreen(container){
 	this.container = container
  	this.bgwidth = window.innerWidth
	this.bgheight = window.innerHeight - (window.innerHeight*0.08)
}

winScreen.prototype = new Area(this.container);
 
winScreen.prototype.setPopupSize = function(_width,_height){

	this.width = _width || window.innerWidth*0.3
	this.height = _height || window.innerHeight*0.3

	this.x = window.innerWidth/2 - this.width/2
	this.y = window.innerHeight/2 - this.height/2
}

winScreen.prototype.init = function(){

	this.x = window.innerWidth/2 - this.width/2
	this.y =  window.innerHeight/2 - this.height/2

	this.bgwidth = window.innerWidth
	this.bgheight = window.innerHeight - (window.innerHeight*0.08)


	if(this.SVG["winScreen-bg"] != undefined){

		console.log("bg update")

		this.updateSVGs({
			
			"id" : "winScreen-bg",
			"width" : this.bgwidth,
			"height" : this.bgheight,
			"x": 0,
			"y": window.innerHeight*0.08,			
		
		})

	}
}

winScreen.prototype.addSVG = function(description){

	description = this.adjustPosition(description)

	if(this.SVG["winScreen-bg"] == undefined){

		var obj = {
			"id" : "winScreen-bg",
			"type" : "rect",
			"width" : this.bgwidth,
			"height" : this.bgheight,
			"x": 0,
			"y": window.innerHeight*0.08,
			"opacity": 0.5,
			"fill": "#000000",
			"click": function(){
				console.log("bg")
			},
		}

		this.SVG[obj.id] = obj
		this.container.append(description.type).attr("id", obj.id)

	}

	this.SVG[description.id] = description 
	this.container.append(description.type).attr("id", description.id)
}

winScreen.prototype.display = function(){

	this.active = true;
	this.init()
 	this.updateSVGs("all");	
}

//---------------------------------menu

function headerMenu(container){
 	this.container = container
  	this.width = window.innerWidth
	this.height = window.innerHeight*0.08

	this.addSVG({
		"id" : "headermenu",
		"child" : "menu",
		"type" : "rect",
	})

	this.addSVG({
		"id" : "logout",
		"child" : "menu",
		"type" : "text",
	})

	this.addSVG({
		"id" : "back",
		"child" : "menu",
		"type" : "text",		
	}) 

 }

 headerMenu.prototype = new Area(this.container);

 headerMenu.prototype.init = function(){

  	this.width = window.innerWidth
	this.height = window.innerHeight*0.08

	this.updateSVGs({
		"id" : "headermenu",
		"child" : "menu",
		"type" : "rect",
		"width" : this.width,
		"height" : this.height,
		"fill" : "#0E1D28", 
		"x" : 0,
		"y" : 0,

	})

	
	this.updateSVGs({
		"id" : "back",
		"child" : "menu",
		"type" : "text",
		"text" : "back",
		"fill" : "#79A5B5",
		"align" : "start",
		"size" : this.height*0.3,
 		"x" : this.width*0.01,
		"y" : this.height/2,
		"click" : function(){

			if(game.experiment.getStatus()){
			
				console.log("winscreen: ", game.winScreen.getStatus())
				console.log("looseScreen: ", game.winScreen.getStatus())

				if(game.winScreen.getStatus()){
					
					console.log("----------winscreenpop----------")
					game.winScreen.pop()
				}
				if(game.looseScreen.getStatus()){
					
					console.log("----------winscreenpop----------")
					game.looseScreen.pop()

				}
				game.experiment.pop()
				mastermind.gameStart()			
			}	
		}
	})

	this.updateSVGs({
		"id" : "logout",
		"child" : "menu",
		"type" : "text",
		"text" : "logout",
		"fill" : "#79A5B5",
		"align" : "end",
		"size" : this.height*0.3,
 		"x" : this.width - this.width*0.01,
		"y" : this.height/2,
		"click" : function(){

			if(game.experiment.getStatus()){
			
				console.log("winscreen: ", game.winScreen.getStatus())
				console.log("looseScreen: ", game.winScreen.getStatus())

				if(game.winScreen.getStatus()){
					
					console.log("----------winscreenpop----------")
					game.winScreen.pop()
				}
				if(game.looseScreen.getStatus()){
					
					console.log("----------winscreenpop----------")
					game.looseScreen.pop()

				}
				game.experiment.pop()
				mastermind.gameStart()			
			}	

		}
	})
}


//---------------------------------customScreen
 
 function customScreen(container,header){
 	this.container = container
 	this.header = header
 	this.init()
 }

 customScreen.prototype = new Area(this.container);

//---------------------------------Experiment

	function experiment(container,header){
		this.container = container
		this.header = header 
		this.widgets = []

		//Paddings
		this.Padding = 15;

		this.init()
	}

	experiment.prototype = new Area(this.container);

	experiment.prototype.init = function(_size){

		var mobile = false;

		if(_size != undefined){
			this.width = _size.width
			this.height = _size.height
		} else{

			this.width = window.innerWidth
			this.height = window.innerHeight - (window.innerHeight*this.header)

		}

		this.scene = {
			"x" : 0+this.Padding,
			"y" : window.innerHeight*this.header+this.Padding, 
		}

		this.dashArea = {}

		if(window.innerWidth < window.innerHeight){

			mobile = true;

			this.scene.width = (window.innerWidth)-2*this.Padding
			this.scene.height = (this.height*0.85)-2*this.Padding

			this.dashArea.width = (window.innerWidth)-2*this.Padding
			this.dashArea.height = (this.height*0.15)-this.Padding
			this.dashArea.y = this.scene.y + this.scene.height + this.Padding
			this.dashArea.x = this.scene.x

		}else{

			this.scene.width = (window.innerWidth*0.70)-2*this.Padding
			this.scene.height = this.height-2*this.Padding

			this.dashArea.width = (window.innerWidth*0.30)-2*this.Padding
			this.dashArea.height = this.height-2*this.Padding
			this.dashArea.y = this.scene.y
			this.dashArea.x = this.scene.x + this.scene.width + 2*this.Padding

		}

		this.dashArea.rowHeight = (this.scene.height)/62

		if (mobile){
			
			for(var i = 0; i < this.widgets.length; i++){

				if(this.widgets[i].mobile == true){

					this.widgets[i].y = this.dashArea.y//(this.widgets[i].start-1) * 9 * this.dashArea.rowHeight + this.dashArea.y
					this.widgets[i].x = this.dashArea.x
					this.widgets[i].width = this.dashArea.width
					this.widgets[i].height = this.dashArea.height
				
				}else{

					this.widgets[i].y = 0//(this.widgets[i].start-1) * 9 * this.dashArea.rowHeight + this.dashArea.y
					this.widgets[i].x = 0
					this.widgets[i].width = 0
					this.widgets[i].height = 0

				}

			}

		}else{

			for(var i = 0; i < this.widgets.length; i++){

				this.widgets[i].y = (this.widgets[i].start) * 9 * this.dashArea.rowHeight + this.dashArea.y
				this.widgets[i].x = this.dashArea.x
				this.widgets[i].width = this.dashArea.width
				this.widgets[i].height = ((this.widgets[i].end - this.widgets[i].start ) * 9 * this.dashArea.rowHeight) - this.dashArea.rowHeight

			}

		}

	}

	experiment.prototype.addWidget = function(_start,_end,_mobile) {

		var description = {
			"start" : _start,
			"end" : _end,
			"y" : ((_start) * 9 * this.dashArea.rowHeight) + this.dashArea.y,
			"x" : this.dashArea.x,
			"width": this.dashArea.width,
			"height": ((_end - _start ) * 9 * this.dashArea.rowHeight) - this.dashArea.rowHeight,
			"mobile" : _mobile
		}

		this.widgets.push(description)
		this.init()

	}

