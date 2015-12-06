

// slid.route.js 
var uiid = require("../utils/utils.js");
var multer = require("multer");
var path = require("path");
var SlidController = require("./../controllers/slid.controller.js");
var express = require("express");
var CONFIG = require("./../../config.json");
var router = express.Router();

var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
		  cb(null, 'uploads/');
	  },
	  filename: function (req, file, cb) {
		  console.log("file: " + JSON.stringify(file));
		  cb(null, uiid() + path.extname(file.originalname));
	  }
});

var upload = multer({ storage: storage });

router.post("/slids", upload.single("file"), function(request, response){ 
	//console.log(request.file.path); //  The full path to the uploaded file
	//console.log(request.file.originalname); // Name of the file on the  user's computer     
	//console.log(request.file.mimetype); // Mime type of the file
	var ofname = request.file.originalname;
	var fname = request.file.filename;
	var titre = ofname.substr(0, ofname.lastIndexOf('.'));
	var id = fname.substr(0, fname.lastIndexOf('.'));
	var type = path.extname(request.file.originalname).substr(1);

	var json_file ={};
	json_file["id"]= id;
	json_file["type"]= type;
	json_file["title"]=titre;
	json_file["filename"]= request.file.filename;
	json_file["data"]=request.file;

	console.log("json_file: " + JSON.stringify(json_file));

	SlidController.create(json_file, true, function(err, data){
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