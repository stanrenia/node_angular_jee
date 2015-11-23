angular.module('commServices', ['factoryServices']).factory('comm',commFnc);
commFnc.$inject=['$http','$q','factory'];

function commFnc($http,$q, factory){
    // *** FOR LOCAL TEST:
    //var imgs = ["img/Chad_Fullbring.jpg", "img/GuildWars2.jpg", "img/rio_saeba.jpg", ""];
    var contentMap = {"37ba76b1-5c5d-47ef-8350-f4ea9407276d": {
        "type": "IMG_B64",
        "id": "37ba76b1-5c5d-47ef-8350-f4ea9407276d",
        "title": "NAO",
        "fileName": "37ba76b1-5c5d-47ef-8350-f4ea9407276d.png",
        "src": "img/37ba76b1-5c5d-47ef-8350-f4ea9407276d.png"
    }, "5095753f-14ca-4c1d-9236-52686ce9af4d": {
        "type": "IMG_B64",
        "id": "5095753f-14ca-4c1d-9236-52686ce9af4d",
        "title": "no title",
        "fileName": "5095753f-14ca-4c1d-9236-52686ce9af4d.jpg",
        "src": "img/5095753f-14ca-4c1d-9236-52686ce9af4d.jpg"
    }, "b4f0d8a7-aeaa-4f9b-abae-8f3187969b09":{
        "type": "IMG_B64",
        "id": "b4f0d8a7-aeaa-4f9b-abae-8f3187969b09",
        "title": "no title",
        "fileName": "b4f0d8a7-aeaa-4f9b-abae-8f3187969b09.jpg",
        "src": "img/b4f0d8a7-aeaa-4f9b-abae-8f3187969b09.jpg"
    }};

    var comm = {
         loadImages:       loadImages,
         loadPres:          loadPres,
         savePres:      savePres
     };

    function loadImages(){
        var deferred = $q.defer();

        // FOR LOCAL TEST
        setTimeout(function(){
            deferred.resolve(contentMap);
        }, 500);

        // FOR RELEASE
        /*$http.get('/resources_list').
            success(function(data, status){
                var cMap = {};
                if(typeof data.contentMap !== "undefined")
                    cMap = data.contentMap;
                deferred.resolve(cMap);
            }).
            error(function(data, status){
                var msg = "Error: ";
                if(status == 400) msg += "BAD REQUEST";
                deferred.reject(msg);
            });*/

        return deferred.promise;
    }

    function loadPres(){
        var deferred = $q.defer();
        // FOR LOCAL TEST
        $http.get("/loadPres")
            .success(function(data){
                if(data)
                    deferred.resolve(data);
                else
                    deferred.reject();
            })
            .error(function(data){
                deferred.reject();
            });

        // FOR RELEASE
        /*$http.get('/loadPres'). // TODO pass the Presentation name/ID to the server
            success(function(data, status){
                var dpres = {};
                if(typeof data.pres !== "undefined")
                    dpres = data.pres;
                deferred.resolve(dpres);
            }).
            error(function(data, status){
                var msg = "Error: ";
                if(status == 400) msg += "BAD REQUEST";
                deferred.reject(msg);
            });*/

        return deferred.promise;
    }


    function savePres(){
        //TODO
    }

    if(io != undefined){
        comm.io = {};
        comm.io.socketConnection=function(scope,uuid){
            var socket = io.connect();
            if(uuid != undefined)
                comm.io.uuid=uuid;
            socket.on('connection', function () {
                console.log("YOU ARE CONNECTED!");
                socket.emit('data_comm',{'id':comm.io.uuid});
            });
            socket.on('newPres', function (pres) {
                if(pres && pres.id){
                    scope.currentPresentation = scope.presentationMap[pres.id];
                    console.log("current Pres has changed");
                }
            });
            socket.on('currentSlidEvent', function (data) {
                if(data.slid)
                    scope.currentSlide = data.slid;
                //if(data.content && data.content !== null)
            });
            return socket;
        }
        comm.io.emitPrev=function(socket){
            socket.emit('slidEvent', {'CMD':"PREV"});
            console.log("PREV");
        }
        comm.io.emitNext=function(socket){
            socket.emit('slidEvent', {'CMD':"NEXT"});
        }
        comm.io.emitStart=function(socket,presUUID){
            socket.emit('slidEvent', {'CMD':"START",'PRES_ID':presUUID});
        }
        comm.io.emitPause=function(socket){
            socket.emit('slidEvent', {'CMD':"PAUSE"});
        }
        comm.io.emitBegin=function(socket){
            socket.emit('slidEvent', {'CMD':"BEGIN"});
        }
        comm.io.emitEnd=function(socket){
            socket.emit('slidEvent', {'CMD':"END"});
        }
    }
    else console.warn("io is undefined");

    return comm;
}
    