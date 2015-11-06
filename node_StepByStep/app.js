/**
 * Created by stan_ on 04/11/2015.
 */

console.log("It Works!");

var express = require("express");
var path = require("path");
//var bodyParser = require('body-parser');
var http = require("http");
var CONFIG = require("./config.json");
var getListFile = require("./myListFile.js");
process.env.CONFIG = JSON.stringify(CONFIG);
// use var CONFIG = JSON.parse(process.env.CONFIG);
var app = express();

var defaultRoute = require("./app/routes/default.route.js");

app.use(defaultRoute);


var server = http.createServer(app);
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
app.use("/watch", express.static(path.join(__dirname, "public/watch")));
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/loadPres", function(request, response){
    getListFile(CONFIG.presentationDirectory, "json", function(err, files) {
        if(err){
            console.error(err);
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
        queryResponse+= data;
        console.log('data' + queryResponse);
    });

    request.on('end', function(){
        console.log('end: ' + queryResponse);
        // JSON.parse()
    });
});


