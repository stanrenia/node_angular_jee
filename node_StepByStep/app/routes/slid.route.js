

// slid.route.js 
var multer = require("multer");
var SlidController = require("./../controllers/slid.controller.js");
var express = require("express");
var router = express.Router();
module.exports = router;
var multerMiddleware = multer({ "dest": "/tmp/" });

router.post("/slids", multerMiddleware.single("file"), function(request, response){ 
	console.log(request.file.path); //  The full path to the uploaded file
	console.log(request.file.originalname); // Name of the file on the  user's computer     
	console.log(request.file.mimetype); // Mime type of the fil
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