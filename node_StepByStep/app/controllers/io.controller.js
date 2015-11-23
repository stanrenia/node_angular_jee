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

exports.listen = function(server){

    // IO server connection
    if(server == undefined)
        return;
    var io = require("socket.io")(server);

    // Handling IO events
    io.on("connection", function (socket) {
        socket.emit("connection");

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
                var err = changePres(cmd.PRES_ID);
                if(!err){
                    console.log("Pres Event: " + JSON.stringify(curPres));
                    socket.emit("newPres", curPres);
                    socket.broadcast.emit("newPres", curPres);
                }
            }

            var dataToSend = getSlidFromCommand(cmd.CMD);
            if(dataToSend === null){
                socket.emit("error", "Start Presentation or check given parameters");
                return;
            }
            console.log("dataToSend: " + JSON.stringify(dataToSend));
            socket.emit("currentSlidEvent", dataToSend);
            socket.broadcast.emit("currentSlidEvent", dataToSend);
        });
    });

    // sub functions
    function getSlidFromCommand(cmd){
        // check arg
        if(curPres === null){
            return null;
        }

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
                if(curSlidIndex < curPres.slidArray.length)
                    curSlidIndex++;
                break;
            case cmdList.PREV:
                if(curSlidIndex > 0)
                    curSlidIndex--;
                break;
            default: return null;
        }

        var nextSlid = curPres.slidArray[curSlidIndex]; //TODO check obj type
        var content = null;
        if(nextSlid.contentMap[1] != undefined){
            console.log("IN FUNCTION: ");
            SlidModel.read(nextSlid.contentMap[1], function(err, data){
                if(!err){
                    content = data;
                    content.src = "/img/" + content.filename;
                }
                return {slid: nextSlid, content: content};
            });
        }
        console.log("NOT IN FUNCTION: ");
        return {slid: nextSlid, content: null};
    }

    function changePres(pres_id){
        getListFile(CONFIG.presentationDirectory, "json", function(err, files) {
            if(err){
                return 1;
            }
            else{
                files.forEach(function(file){
                    var jfile_path = path.join(CONFIG.presentationDirectory, file);
                    var jfile = require(jfile_path);
                    if (pres_id == jfile.id){
                        curPres = jfile;
                        return 0;
                    }
                });
                return 2;
            }
        })
    }
};
