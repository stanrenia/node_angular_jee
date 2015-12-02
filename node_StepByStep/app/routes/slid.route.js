

// slid.route.js 
var uiid = require("../utils/utils.js");
var multer = require("multer");
var path = require("path");
var SlidController = require("./../controllers/slid.controller.js");
var express = require("express");
var CONFIG = require("./../../config.json");
var router = express.Router();
module.exports = router;
var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, 'uploads/')
	  },
	  filename: function (req, file, cb) {
	    cb(null, uiid() + '.jpg') //Appending .jpg
	  }
})

var upload = multer({ storage: storage });

router.post("/slids", upload.single("file"), function(request, response){ 
	console.log(request.file.path); //  The full path to the uploaded file
	console.log(request.file.originalname); // Name of the file on the  user's computer     
	console.log(request.file.mimetype); // Mime type of the file

	var json_file ={}
	var titre = request.file.originalname.split(".");
	var id = request.file.path.split("\\");
	
	json_file["id"]= id[id.length -1];
	json_file["type"]=request.file.mimetype;
	json_file["title"]=titre[0];
	json_file["filename"]=null;
	json_file["data"]=request.file;
	
	SlidController.create(json_file, function(err, data){
		if(err){
			response.status(400).send("List of contents not available. Cause: " + err);
			console.log("data erreur:"+err);
		}
		else{
			//console.log("List slid: " + listSlid); //  The full path to the uploaded file
			response.json(data);
			console.log("data:"+JSON.stringify(data));
		}
	});
	
	
});

router.get("/slids", function(request, response){
	SlidController.list(function(err, listSlid){
		if(err){
			response.status(400).send("List of contents not available. Cause: " + err);
		}
		else{
			//console.log("List slid: " + listSlid); //  The full path to the uploaded file
			response.json(listSlid);
		}
	});
});



module.exports = router;