/**
 * Created by stan_ on 04/11/2015.
 */

console.log("It Works!");
var slid_class=require("./app/models/slid.model.js");
var express = require("express");
var path = require("path");
var fs =require("fs");
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
app.use("/test", express.static(__dirname));
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
//var include = function(url, callback){
//	 
//    /* on crée une balise<script type="text/javascript"></script> */
//    var script = document.createElement('script');
//    script.type = 'text/javascript';
// 
//    /* On fait pointer la balise sur le script qu'on veut charger
//       avec en prime un timestamp pour éviter les problèmes de cache
//    */
// 
//    script.src = url + '?' + (new Date().getTime());
// 
//    /* On dit d'exécuter cette fonction une fois que le script est chargé */
//    if (callback) {
//        script.onreadystatechange = callback;
//        script.onload = script.onreadystatechange;
//    }
// 
//    /* On rajoute la balise script dans le head, ce qui démarre le téléchargement */
//    document.getElementsByTagName('head')[0].appendChild(script);
//}

//$('app/models/slid.model.js', function() {
var slid =new slid_class();
//console.log("slid app.js:"+slid);
slid.type = "pdf";
//console.log("slid app.js modif type:"+slid.type);
slid.setData("Documents de recherche");
//console.log("slid app.js modif data:"+slid.data);
slid.id= "heetch28";
slid.title ="Les fourmis";
slid.filename = slid.id+".pdf";

slid.create(slid, function(err, data){
	console.log("create");
	console.log("create data:"+ data);
});

//var test=slid.read(slid.id, function(err, data){
//	console.log("read");
//	if(err)throw err;
//	console.log("read data: "+ data);
//});
//console.log(test);

//var slid2=slid_class();
//slid2.type = "png";
//slid2.setData("Texte de recherche");
//slid2.id= "blablacar8";
//slid2.title ="Les réseaux de neuronnes";
//slid.filename = slid.id+".png";
//
//slid.update(slid2, function(err, data){
//	console.log(slid2);
//	console.log(data);
//})
//
//slid.suppr(slid2.id, function(err, data){
//	console.log(data);
//})
	
	
//});