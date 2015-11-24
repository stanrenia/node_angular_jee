/**
 * Created by stan_ on 21/11/2015.
 */
var stateList = {"PAUSING": 0, "PLAYING": 1};
var playerState = stateList.PAUSING;
var playerDelay = 3000;
var cmdList = {START: "START", PAUSE: "PAUSE", NEXT: "NEXT", PREV: "PREV", BEGIN: "BEGIN", END: "END"};
var socketMap = {};
var curPres = null;
var curSlidIndex = 0;
var getListFile = require("../../myListFile.js");
var path = require("path");
var SlidModel = require("../models/slid.model.js");
var CONFIG = JSON.parse(process.env.CONFIG);
var autoPlay = null;

exports.listen = function(server){

    // IO server connection
    if(server == undefined)
        return;
    var io = require("socket.io")(server);

    // Handling IO events
    io.on("connection", function (socket) {
        // First thing is notify the client in order to get his ID from 'data_comm' event
        socket.emit("connection");
        socket.on("data_comm", function(id){
            socketMap[id] = socket;
        });
        // Handling server internal errors
        socket.on('error', function (data) {
            console.warn("** Error event ** :");
            if(data)
                console.warn(data);
        });

        // Receving commands from Admin
        socket.on("slidEvent", function (cmd) {
            console.log("slidEvent: " + JSON.stringify(cmd));
            // Handling BAD requests
            if(cmd.CMD == undefined){
                console.warn("errorClient: Wrong given parameters");
                socket.emit("errorClient", "Wrong given parameters");
                return;
            }
            if(cmd.CMD == cmdList.START && cmd.PRES_ID == undefined){
                console.warn("errorClient: Missing a parameter");
                socket.emit("errorClient", "Missing a parameter");
                return;
            }
            else if(cmd.CMD == cmdList.START && cmd.PRES_ID != undefined){
                // Change Presentation if START + PRES_ID different than curPres.id
                changePres(cmd.PRES_ID, function(err){
                    if(err){
                        socket.emit("error", err);
                    }
                    else{
                        console.log("Pres Event: " + JSON.stringify(curPres));
                        // Notify admin + watchers about the new presentation
                        socket.emit("newPres", curPres);
                        socket.broadcast.emit("newPres", curPres);
                        // Get the first slide of this new presentation and notify clients
                        getSlidFromCommand(cmd.CMD, function(err, dataToSend){
                            if(err){
                                socket.emit("error", err);
                            }
                            else{
                                // Start auto-play
                                if(autoPlay != null)
                                    clearInterval(autoPlay);
                                autoPlay = setInterval(function(){
                                    autoPlayFct(socket);
                                }, playerDelay);
                                console.log("dataToSend: " + JSON.stringify(dataToSend));
                                // Notify admin + watchers
                                socket.emit("currentSlidEvent", dataToSend);
                                socket.broadcast.emit("currentSlidEvent", dataToSend);
                            }
                        });
                    }
                });
            }

            if(curPres !== null)
            {   // Others command than START
                getSlidFromCommand(cmd.CMD, function(err, dataToSend){
                    if(err){
                        socket.emit("error", err);
                    }
                    else{
                        if(playerState == stateList.PAUSING && autoPlay !== undefined){
                            // Cancel the auto-play
                            clearInterval(autoPlay);
                        }
                        else if(playerState == stateList.PLAYING && autoPlay !== undefined){
                            // Reset auto-play interval time (if we manually change a slide, the countdown is reset before it changes again)
                            clearInterval(autoPlay);
                            autoPlay = setInterval(function(){
                                autoPlayFct(socket);
                            }, playerDelay);
                        }
                        // Notify admin + watchers
                        console.log("dataToSend: " + JSON.stringify(dataToSend));
                        socket.emit("currentSlidEvent", dataToSend);
                        if(dataToSend.slid != 0){
                            socket.broadcast.emit("currentSlidEvent", dataToSend);
                        }
                    }
                });
            }
            else{
                console.warn("errorClient: Start presentation first");
                socket.emit("errorClient", "Start presentation first");
            }
        });

        function autoPlayFct(socket){
            // Get the next slide and notify clients
            if(playerState == stateList.PLAYING && curPres !== null){
                getSlidFromCommand(cmdList.NEXT, function(err, dataToSend){
                    if(err){
                        socket.emit("error", err);
                    }
                    else{
                        socket.emit("currentSlidEvent", dataToSend);
                        if(dataToSend.slid != 0){
                            socket.broadcast.emit("currentSlidEvent", dataToSend);
                        }
                    }
                })
            }
        }
    });

    // sub functions

    function getSlidFromCommand(cmd, callback){
        // Get slid depending on the given command
        console.log("getSlidFromCmd: " + cmd);
        var backidx = curSlidIndex;
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

        if(backidx == curSlidIndex){
            return callback(null, {slid: 0, content: null});
        }

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
                    content.src = CONFIG.contentDirectory.slice(1)+ "/" + content.filename;
                    return callback(null, {slid: nextSlid, content: content});
                }
            });
        }
        else return callback(null, {slid: nextSlid, content: null});
    }

    function changePres(pres_id, callback){
        // Reads presentation files located in /presentation_content and get the corresponding presentation
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
