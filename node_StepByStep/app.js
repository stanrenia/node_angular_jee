/**
 * Created by stan_ on 04/11/2015.
 */

console.log("It Works!");
var SlidModel=require("./app/models/slid.model.js");

var CONFIG = require("./config.json");
var getListFile = require("./myListFile.js");

var path = require("path");
var fs =require("fs");
var http = require("http");
var express = require("express");

process.env.CONFIG = JSON.stringify(CONFIG);

//var defaultRoute = require("./app/routes/default.route.js");
var slidRoute = require("./app/routes/slid.route.js");
//var UserRoute = require("./app/routes/user.route.js");

var app = express();
app.use(slidRoute);

var server = http.createServer(app);
var IOcontroller = require("./app/controllers/io.controller.js");
IOcontroller.listen(server);
server.listen(CONFIG.port);

app.get("/", function(request, response){
    response.send("It works");
});

//
//app.use(function(request, response, callback){
//    response.send("It works 145 !");
//    callback();
//});
var __dirname = "./";
app.use("/test", express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));
app.use("/admin", express.static(path.join(__dirname, "public/admin")));

app.use("/loadPres", function(request, response){
    getListFile(CONFIG.presentationDirectory, "json", function(err, files) {
        if(err){
            console.error(err);
            response.status(500).send("Server can not get presentations");
        }
        else{
            var LoadPres = {};
            files.forEach(function(file){
                var jfile_path = path.join(CONFIG.presentationDirectory, file);
                jfile_path = CONFIG.presentationDirectory + "/" + file;
                //console.log("jpath file: " +jfile_path);
                var jfile = require(jfile_path);
                LoadPres[jfile.id] = jfile;
                });
            //console.log("LoadPres: " + LoadPres);
            //console.log("stringify: " +JSON.stringify(LoadPres));
            response.send(LoadPres);
        }
    })
});

app.use("/savePres", function(request, response){
    var queryResponse= "";
    request.on('data', function(data) {
        queryResponse= queryResponse +data;
        console.log('data' + queryResponse);
    });

    request.on('end', function(){
        console.log('end: ' + queryResponse);
        
        var res_json = JSON.parse(queryResponse);
        var id_json=res_json.id;
        
        json_path = CONFIG.presentationDirectory + "/" +id_json +".pres.json";
        fs.writeFile(json_path, JSON.stringify(res_json), function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("JSON saved to " + json_path);
            }
        });
    });
});

app.use("/slids", function(request, response){
	var queryResponse= "";
    request.on('data', function(data) {
        queryResponse= queryResponse +data;
        console.log('data' + queryResponse);
    });

    request.on('end', function(){
        console.log('end: ' + queryResponse);
        
        var res_json = JSON.parse(queryResponse);
        var id_json=res_json.id;
        
        var slid = new SlidModel();     
        
        slid.type = res_json.type;
        slid.setData(res_json.data);
        slid.id= res_json.id;
        slid.title = res_json.title;
        slid.filename = res_json.filename;


        SlidModel.create(slid, function(err, data){
        	
        if(err){
            console.log("Slid non crée !");
        }else{
            console.log("create slid");
            console.log("Slid created:  "+data);
        }
        });
    });
});

/*var slid = new SlidModel();
//
//
slid.type = "txt";
slid.setData("Test static pour stan");
slid.id= "teststatic";
slid.title ="Les test static pour stan";
slid.filename = "teststatic.txt";


SlidModel.create(slid, function(err, data){
    if(err) return;
	console.log("create");
	console.log(data);

    SlidModel.suppr(slid.id, function(err, data){
        console.log("data:"+data+"en cours de suppression ..");
        console.log("slid supprimé !");
    });
});*/
//
//SlidModel.read(slid.id, function(err, data){
//	console.log("read\n");
//	 
//	 console.log("test dans le read app:"+data);
//});
//
//slid.setData("Nouveau texte pour stan");
//slid.title ="Les réseaux de neuronnes";
//
//SlidModel.update(slid, function(err, data){
//	console.log("slid updated: " +data);
//	console.log("slid : " +JSON.stringify(slid));
//})
//


	
//});