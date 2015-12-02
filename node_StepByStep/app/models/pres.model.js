/**
 * Created by ikito on 02/12/15.
 */
var getListFile = require("../../myListFile.js");
var path = require("path");

var PresModel=function (pmodel) {

    pmodel=check_attr(pmodel);
//	console.log("class slid.model.js:"+pmodel.type);

    this.description=pmodel.description;
    this.id=pmodel.id;
    this.title=pmodel.title;
    this.slidArray=pmodel.slidArray;

    function check_attr(pmodel){
        if(typeof pmodel === "undefined")
        {
            pmodel={description: null, id: null, title: null, slidArray: null};
        }
        else{
            if(typeof pmodel.description === "undefined")
                pmodel["type"]=null;
            if(typeof pmodel.id === "undefined")
                pmodel["id"]=null;
            if(typeof pmodel.title === "undefined")
                pmodel["title"]=null;
            if(typeof pmodel.slidArray === "undefined")
                pmodel["filename"]=null;
        }
        return pmodel;
    }
}

PresModel.read=function(id, callback){
    var fs =require("fs");
    var CONFIG = JSON.parse(process.env.CONFIG);
    var pres_path=CONFIG.presentationDirectory + "/" +id +".pres.json";
    fs.readFile(pres_path, function (err, data) {
        if (err) return callback(err);
        data= JSON.parse(data.toString());
        callback(null, data);
    });
}

PresModel.getAll=function(callback){
    var fs =require("fs");
    var CONFIG = JSON.parse(process.env.CONFIG);
    getListFile(CONFIG.presentationDirectory, "json", function(err, files) {
        if(err){
            callback(err);
        }
        else{
            var LoadPres = {};
            var i= 0, len=files.length;
            files.forEach(function(file){
                var jfile_path = path.join(CONFIG.presentationDirectory, file);
                fs.readFile(jfile_path, function(err, data){
                    if(err){
                        return callback(err);
                    }
                    else{
                        data = JSON.parse(data.toString());
                        LoadPres[data.id] = data;
                        if(i == len-1){
                            return callback(null, LoadPres);
                        }
                        i++;
                    }
                });
            });
        }
    })
}

module.exports = PresModel;