/**
 * Created by stan_ on 21/11/2015.
 */
var stateList = {"PAUSING": 0, "PLAYING": 1};
var playerState = stateList.PAUSING;
var cmdList = {START: "START", PAUSE: "PAUSE", NEXT: "NEXT", PREV: "PREV", BEGIN: "BEGIN", END: "END"};
var socketMap = {};
var curPres = null;
var curSlidIndex = 0;
var getListFile = require("../../myListFile.js");
var path = require("path");
var SlidModel = require("../models/slid.model.js");
var CONFIG = JSON.parse(process.env.CONFIG);

exports.listen = function(server){

    // IO server connection
    if(server == undefined)
        return;
    var io = require("socket.io")(server);

    // Handling IO events
    io.on("connection", function (socket) {
        socket.emit("connection");
        socket.on('error', function (data) {
            console.warn("** Error event ** :");
            if(data)
                console.warn(data);
        });
        socket.on("data_comm", function(id){
            socketMap[id] = socket;
        });

        socket.on("slidEvent", function (cmd) {
            console.log("slidEvent: " + JSON.stringify(cmd));
            if(cmd.CMD == undefined){
                socket.emit("error", "Wrong given parameters");
                return;
            }
            if(cmd.CMD == cmdList.START && cmd.PRES_ID == undefined){
                socket.emit("error", "Missing a parameter");
                return;
            }
            else if(cmd.CMD == cmdList.START && cmd.PRES_ID != undefined){ // Change Presentation if START + PRES_ID different than curPres.id
                changePres(cmd.PRES_ID, function(err){
                    if(err){
                        socket.emit("error", err);
                    }
                    else{
                        console.log("Pres Event: " + JSON.stringify(curPres));
                        socket.emit("newPres", curPres);
                        socket.broadcast.emit("newPres", curPres);
                        getSlidFromCommand(cmd.CMD, function(err, dataToSend){
                            if(err){
                                socket.emit("error", err);
                            }
                            else{
                                console.log("dataToSend: " + JSON.stringify(dataToSend));
                                socket.emit("currentSlidEvent", dataToSend);
                                socket.broadcast.emit("currentSlidEvent", dataToSend);
                            }
                        });
                    }
                });
            }

            if(curPres !== null)
            {
                getSlidFromCommand(cmd.CMD, function(err, dataToSend){
                    if(err){
                        socket.emit("error", err);
                    }
                    else{
                        console.log("dataToSend: " + JSON.stringify(dataToSend));
                        socket.emit("currentSlidEvent", dataToSend);
                        socket.broadcast.emit("currentSlidEvent", dataToSend);
                    }
                });
            }
        });
    });

    // sub functions
    function getSlidFromCommand(cmd, callback){
        console.log("getSlidFromCmd: " + cmd);

        switch (cmd){
            case cmdList.START:
                playerState = stateList.PLAYING;
                break;
            case cmdList.PAUSE:
                playerState = stateList.PAUSING;
                break;
            case cmdList.BEGIN:
                curSlidIndex = 0;
                break;
            case cmdList.END:
                curSlidIndex = curPres.slidArray.length-1;
                break;
            case cmdList.NEXT:
                if(curSlidIndex < curPres.slidArray.length-1)
                    curSlidIndex++;
                break;
            case cmdList.PREV:
                if(curSlidIndex > 0)
                    curSlidIndex--;
                break;
            default: console.warn("In default (switch)"); return callback("error command does not match");
        }

        console.log("Index: " + curSlidIndex);
        var nextSlid = curPres.slidArray[curSlidIndex]; //TODO check obj type
        console.log("nextSlid: " + nextSlid.id);
        var content = null;
        if(nextSlid.contentMap[1] != undefined){
            SlidModel.read(nextSlid.contentMap[1], function(err, data){
                if(err){
                    return callback(err);
                }
                else{
                    content = data;
                    content.src = "/img/" + content.filename;
                    return callback(null, {slid: nextSlid, content: content});
                }
            });
        }
        else return callback(null, {slid: nextSlid, content: null});
    }

    function changePres(pres_id, callback){
        var presPath = path.resolve(path.dirname(require.main.filename), CONFIG.presentationDirectory);
        console.log("presPath: " + presPath);
        getListFile(presPath, "json", function(err, files) {
            if(err){
                return callback("Error in getListFile called by changePres:" + err);
            }
            else{
                files.forEach(function(file){
                    var jfile_path = path.join(presPath, file);
                    var jfile = require(jfile_path);
                    if (pres_id == jfile.id){
                        curPres = jfile;
                        return callback(null);
                    }
                    if(file === files[files.length-1])
                        return callback("presentation id not found");
                });
            }
        });
    }
};
