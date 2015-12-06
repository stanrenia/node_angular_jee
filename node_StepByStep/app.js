/**
 * Created by stan_ on 04/11/2015.
 */

console.log("It Works!");
var SlidModel=require("./app/models/slid.model.js");
var PresModel=require("./app/models/pres.model.js");
var authUser = require("./app/controllers/auth.controller.js");
var CONFIG = require("./config.json");
var requests = require("request");
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

app.post("/fakeauth", function(request, response){
    var queryResponse= "";
    request.on('data', function(data) {
        queryResponse= queryResponse +data;
    });

    request.on('end', function() {
        var params = JSON.parse(queryResponse);

        // *** Authentication request to JEE WebService ***
        requests.post("http://localhost:8080/FrontAuthWatcher/WatcherAuth",
            {body: {login: params.login, pwd: params.pwd}, json: true},
            function(err, res, body){
                if(err){
                    response.status(401).send("");
                }
                else{
                    //console.log("Body req: " + body + " " + JSON.stringify(body));
                    if(body.validAuth){
                        var page = "";
                        var user = authUser.createUser({login: params.login, pwd: params.pwd, role: body.role});
                        if(body.role == "admin"){
                            page = "/admin/admin.html";
                            response.send({user: user, page: page});
                        }
                        else if(body.role == "watcher"){
                            page = "/watch/watch.html";
                            response.send({user: user, page: page});
                        }
                        else{
                            response.status(403).send("Access Forbidden");
                        }
                    }
                    else{
                        response.status(403).send("Access Forbidden");
                    }
                }
        });
        /*if(params.login == "jdoe"){
            user = authUser.createUser({login: params.login, pwd: params.pwd, role: "admin"});
            console.log("User created: " + JSON.stringify(user));
            response.send({user: user});
        }
        else if(params.login == "w"){
            user = authUser.createUser({login: params.login, pwd: params.pwd, role: "watcher"});
            console.log("User created: " + JSON.stringify(user));
            response.send({user: user});
        }
        else{
            response.status(403).send("Access Forbidden");
        }*/
    });
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/login", express.static(path.join(__dirname, "public/login")));

app.use("/loadPres", function(request, response){
    var presID = request.query.presid;
    if(presID !== undefined){
        PresModel.read(presID, function(err, presData){
            if(err){
                return response.status(500).send("Server can not get the given presentation");
            }
            else{
                return response.send(presData);
            }
        });
    }
    else{
        PresModel.getAll(function(err, presData){
            if(err){
                return response.status(500).send("Server can not get presentations");
            }
            else{
                return response.send(presData);
            }
        })
    }
});

app.post("/savePres", function(request, response){
    var queryResponse= "";
    request.on('data', function(data) {
        queryResponse= queryResponse +data;
    });

    request.on('end', function(){

        var req_json = JSON.parse(queryResponse);
        var pres = req_json.pres;
        var pres_id=req_json.pres_id;
        var id = req_json.id;
        console.log("SavePres data:  " + JSON.stringify(req_json));

        // *** Check if user is autenticated ***
        if(authUser.getUserFromID(id) != null){
            var json_path = CONFIG.presentationDirectory + "/" +pres_id +".pres.json";
            fs.writeFile(json_path, JSON.stringify(pres), function(err) {
                if(err) {
                    console.log(err);
                    response.status(500).send("Error occured while saving the presentation");
                } else {
                    response.send("OK");
                }
            });
        }
        else{
            console.log("A saving presentation demand has been blocked because user is not authenticated");
            response.status(403).send("Access Forbidden!");
        }

    });
});


