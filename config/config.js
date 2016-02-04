var config = {

	"levelConfig" : {

		"easy" : {

			"secretSize": 2,
			"colors" : 2,
			"dificulty" : 10,
		},

		"normal" : {

			"secretSize": 5,
			"colors" : 7,
			"dificulty" : 10,
		},

		"hard" : {

			"secretSize": 6,
			"colors" : 8,
			"dificulty" : 10,
		},

		"custom" : {

			"display" : true,
			"secretSize": 10,
			"colors" : 5,
			"dificulty" : 10,
			"max" : {
			
				"color":8,
				"holes":10
			},
			"min" : {
				"color" : 3,
				"holes" : 3,
			}

		} 

	},

	"other" : {

		"incompleteCheck" : true,
		"tutorial" : false,
		"JarMode" : {

			"display" : true,
			"recipe" :  [3,4,4,3] 
		},

	},

}