var SlidModel=require("./../models/slid.model.js");
var CONFIG = require("./../../config.json");
var getListFile = require("./../../myListFile.js");

function list(){
	getListFile(CONFIG.presentationDirectory, "json", function(err, files) {
        if(err){
            console.error(err);
        }
        else{
            var list_slid = {};
            files.forEach(function(file){
                var jfile_path = path.join(CONFIG.presentationDirectory, file);
                jfile_path = CONFIG.presentationDirectory + "/" + file;
                //console.log("jpath file: " +jfile_path);
                var jfile = require(jfile_path);
                var slidmodel = new SlidModel(jfile);
                
                SlidModel.read(slidmodel.id, function(err, str_slid){
                	console.log("slid_lu controller:"+ str_slid);
                })
                
                var json_sm = JSON.parse(slidmodel);
                
                list_file[jfile.id] = json_sm;
                });
            //console.log("LoadPres: " + LoadPres);
            //console.log("stringify: " +JSON.stringify(LoadPres));
        }
        return list_file;
	});
	
}
function create(){
	
}

function read(){
	
}