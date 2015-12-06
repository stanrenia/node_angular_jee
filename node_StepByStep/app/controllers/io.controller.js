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
var PresModel=require("../models/pres.model.js");
var authUser = require("./auth.controller.js");
var CONFIG = JSON.parse(process.env.CONFIG);
var autoPlay = null;

exports.listen = function(server){

    // IO server connection
    if(server == undefined)
        return;
    var io = require("socket.io")(server);

    // Handling IO events
    io.on("connection", function (socket) {
        // First thing is notifying the client in order to get his ID from 'data_comm' event
        socket.emit("connection");
        // If the given ID is matching a User ID, socket is keeping alive. Otherwise, socket is disconnected.
        socket.on("data_comm", function(data){
            console.log("Socket connection on ID: " + data.id);
            if(authUser.getUserFromID(data.id) == null){
                console.log("Disconnecting a socket");
                socket.emit("disconnect");
                socket.disconnect();
            }
            else{
                socketMap[data.id] = socket;
            }
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
            }
            else if(cmd.CMD == cmdList.START && cmd.PRES_ID == undefined){
                console.warn("errorClient: Missing a parameter");
                socket.emit("errorClient", "Missing a parameter");
            }
            else if(cmd.CMD == cmdList.START && cmd.PRES_ID != undefined){
                // Change presentation if START and PRES_ID different from curPres.id , the new presentation starts from its 1st slide, notify admin + clients
                // Keep the same presentation if PRES_ID equals curPres.id, but resumes auto-play, only notify admin. (auto-play will notify admin + clients)
                changePres(cmd.PRES_ID, function(err, isPresChanged){
                    console.log("chgPRes: " + err + " bool: " + isPresChanged);
                    if(err){
                        socket.emit("error", "The given Presentation ID does not match. " + err);
                    }
                    else{
                        console.log("Pres Event: " + JSON.stringify(curPres.title));
                        playerState = stateList.PLAYING;
                        // Start auto-play
                        if(autoPlay !== null)
                            clearInterval(autoPlay);
                        autoPlay = setInterval(function(){
                            autoPlayFct(socket);
                        }, playerDelay);
                        console.log("autoplay: " + typeof autoPlay + " " + playerState);

                        // Get the first slide of this new presentation
                        var nextSlid = curPres.slidArray[0];
                        //
                        if(!isPresChanged)
                            nextSlid = -1; // does nothing but resumes auto-play
                        else
                            curSlidIndex = 0; // presentation has changed so next slid is the 1st one.
                        // Notify admin + watchers about the new presentation
                        var dataToSend = {slid: nextSlid, pres_id: curPres.id};
                        socket.emit("currentSlidEvent", dataToSend);
                        if(isPresChanged)
                            socket.broadcast.emit("currentSlidEvent", dataToSend);
                    }
                });
            }
            else if(curPres !== null)
            {   // Other commands than START
                getSlidFromCommand(cmd.CMD, function(err, dataToSend){
                    if(err){
                        socket.emit("error", err);
                    }
                    else{
                        if(playerState == stateList.PAUSING && autoPlay !== null){
                            // Stop auto-play
                            clearInterval(autoPlay);
                        }
                        else if(playerState == stateList.PLAYING && autoPlay !== null){
                            // Reset auto-play interval time (if we manually change a slide, the countdown is reset before it changes again)
                            //resetPlay(socket);
                            clearInterval(autoPlay);
                            autoPlay = setInterval(function(){
                                autoPlayFct(socket);
                            }, playerDelay);
                        }
                        // Notify admin + watchers
                        console.log("dataToSend: " + JSON.stringify(dataToSend));
                        socket.emit("currentSlidEvent", dataToSend);
                        if(dataToSend.slid != -1){
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

        // sub functions

        function autoPlayFct(socket){
            // Get the next slide and notify clients
            if(playerState == stateList.PLAYING && curPres !== null){
                getSlidFromCommand(cmdList.NEXT, function(err, dataToSend){
                    if(err){
                        socket.emit("error", err);
                    }
                    else{
                        socket.emit("currentSlidEvent", dataToSend);
                        if(dataToSend.slid != -1){
                            socket.broadcast.emit("currentSlidEvent", dataToSend);
                        }
                    }
                })
            }
        }
    }); // end io.on('connection')

    function getSlidFromCommand(cmd, callback){
        // Get slid depending on the given command except for START
        console.log("getSlidFromCmd: " + cmd);
        var backidx = curSlidIndex;
        switch (cmd){
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
            return callback(null, {slid: -1, pres_id: curPres.id});
        }

        var nextSlid = curPres.slidArray[curSlidIndex];
        console.log("nextSlid: " + nextSlid.id);
        return callback(null, {slid: nextSlid, pres_id: curPres.id});
    }

    function changePres(pres_id, callback){
        // If changing presentation works, affects 'curPres' and return true.
        // else: return false
        // return error when PresModel.read() fails
        if(curPres){
            if(curPres.id === pres_id){
                return callback(null, false);
            }
        }
        // Reads presentation files located in /presentation_content and get the corresponding presentation
        PresModel.read(pres_id, function(err, data){
            if(err){
                return callback(err);
            }
            else{
                curPres = data;
                return callback(null, true);
            }
        });
    }
};
