var SlidModel=require("./../models/slid.model.js");
var CONFIG = require("./../../config.json");
var getListFile = require("./../../myListFile.js");
var path = require("path");

function list(callback){
    var dirpath = path.resolve(path.dirname(require.main.filename), CONFIG.contentDirectory);
    console.log("dirpath:" + dirpath);
	getListFile(dirpath, "json", function(err, files) {
        if(err){
            console.error("Error in list(): " + err);
            return callback(err);
        }
        else{
            var list_slid = {};
            for(var i= 0, len=files.length; i< len; i++){
                var jfile_path = path.join(dirpath, files[i]);
                //console.log("jpath file: " +jfile_path);
                var jfile = require(jfile_path);
                for(var key in jfile){
                    console.log("key: " + key +" : " + jfile[key]);
                }
                // slice to remove the '.' from './uploads'
                // concat with '/' because it will be written in HTML
                jfile.src = CONFIG.contentDirectory.slice(1) +"/"+ jfile.fileName;
                list_slid[jfile.id] = jfile;
            }
            if(i == 0){
                return callback("Error: List of contents is empty");
            }
            return callback(null, list_slid);
        }
	});
}
function create(){
	
}

function read(){
	
}

exports.list = list;
exports.create = create;
exports.read = read;