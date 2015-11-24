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
        "src": "/uploads/37ba76b1-5c5d-47ef-8350-f4ea9407276d.png"
    }, "5095753f-14ca-4c1d-9236-52686ce9af4d": {
        "type": "IMG_B64",
        "id": "5095753f-14ca-4c1d-9236-52686ce9af4d",
        "title": "no title",
        "fileName": "5095753f-14ca-4c1d-9236-52686ce9af4d.jpg",
        "src": "/uploads/5095753f-14ca-4c1d-9236-52686ce9af4d.jpg"
    }, "b4f0d8a7-aeaa-4f9b-abae-8f3187969b09":{
        "type": "IMG_B64",
        "id": "b4f0d8a7-aeaa-4f9b-abae-8f3187969b09",
        "title": "Rio",
        "fileName": "b4f0d8a7-aeaa-4f9b-abae-8f3187969b09.jpg",
        "src": "/uploads/b4f0d8a7-aeaa-4f9b-abae-8f3187969b09.jpg"
    }, "d6aad8cd-b3dc-4794-9e2e-efee903a3f5e":{
        "type": "IMG_B64",
        "id": "d6aad8cd-b3dc-4794-9e2e-efee903a3f5e",
        "title": "no title",
        "fileName": "d6aad8cd-b3dc-4794-9e2e-efee903a3f5e.jpg",
        "src": "/uploads/d6aad8cd-b3dc-4794-9e2e-efee903a3f5e.jpg"
    }
    };

    var comm = {
         loadImages:       loadImages,
         loadPres:          loadPres
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
                console.log("currentSlide ID: " + scope.currentSlide.id);
                scope.$apply();
                //if(data.content && data.content !== null)
            });

            socket.on('errorClient', function (data) {
                if(data)
                    console.warn(data);
                //if(data.content && data.content !== null)
            });
            return socket;
        }
    }
    else console.warn("io is undefined");

    return comm;
}
    