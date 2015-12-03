var SlidModel=require("./../models/slid.model.js");
var CONFIG = require("./../../config.json");
var getListFile = require("./../../myListFile.js");
var path = require("path");

function list(callback){
    var dirpath = path.resolve(path.dirname(require.main.filename), CONFIG.contentDirectory);
    //console.log("dirpath:" + dirpath);
	getListFile(dirpath, "json", function(err, files) {
        if(err){
            console.error("Error in list(): " + err);
            return callback(err);
        }
        else{
            var list_slid = {};
            var i= 0, len = files.length;
            files.forEach(function(file){
                 var jfile_path = path.join(dirpath, file);
                 var jfile = require(jfile_path);
                 SlidModel.read(jfile.id, function(err, slid){
                     if(err){
                         return callback("Error reading content: " + err);
                     }
                     else{
                         slid = JSON.parse(slid);
                         // slice to remove the '.' from './uploads'
                         // concat with '/' because it will be written in HTML
                         slid.src = CONFIG.contentDirectory.slice(1) +"/"+ slid.filename;
                         list_slid[slid.id] = slid;
                         if(i == len-1){
                             //console.log("LIST: " + JSON.stringify(list_slid));
                             return callback(null, list_slid);
                         }
                         i++;
                     }
                 });
            });
        }
	});
}

function create(param, isMetaOnly, callback){
	//console.log("param: "+JSON.stringify(param));
    if(isMetaOnly !== true) isMetaOnly = false;

	var slid = new SlidModel(param);

	if(isMetaOnly)
        slid.setData(slid.filename);    // file is created by another function or module, like Multer. So the meta file does not really have data.
    else
        slid.setData(param.data);

	SlidModel.create(slid, isMetaOnly, function(err, smodel){
		if(err){
			callback(err);
		}
		else{
			callback(null,smodel);
		}
	});
}

function read(){
	
}

exports.list = list;
exports.create = create;
exports.read = read;