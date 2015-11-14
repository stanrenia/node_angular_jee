angular.module('commServices', ['factoryServices']).factory('comm',commFnc);
commFnc.$inject=['$http','$q','factory'];

function commFnc($http,$q, factory){
    // *** FOR LOCAL TEST:
    var imgs = ["img/Chad_Fullbring.jpg", "img/GuildWars2.jpg", "img/rio_saeba.jpg", ""];
    var localPres = factory.presentationCreation("FirstPres", "My first presentation");
    var contentMap = {};
    for(var i=0; i<4; i++)
    {
        var content = factory.contentCreation("myContentTitle", "myType", imgs[i]);
        contentMap[content.id] = content;
        var slide = factory.slidCreation("mySlide"+i, "myTxt"+i);
        slide.contentMap[1] = content;
        localPres.slidArray.push(slide);
    } // *** END FOR LOCAL TEST

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
        }, 2000);

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

    function loadPres(presName, presID){
        var deferred = $q.defer();
        // FOR LOCAL TEST
        var pres;
        if(typeof presName === "undefined") deferred.reject("error given parameters are incorrect");
        if(typeof presID !== "undefined"){
            if(localPres.id == presID)
                pres = localPres;
        }
        else{
                if(localPres.title == presName)
                    pres = localPres;
            }
            setTimeout(function(){
            deferred.resolve(pres);
        }, 1000);

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

    comm.io = {};
    comm.io.socketConnection=function(scope,uuid){
        var socket = io.connect();
        comm.io.uuid=uuid;
        socket.on('connection', function () {
            socket.emit('data_comm',{'id':comm.io.uuid});
        });
        socket.on('newPres', function (socket) {
        });
        socket.on('slidEvent', function (socket) {
        });
        return socket;
    }
    comm.io.emitPrev=function(socket){
        socket.emit('slidEvent', {'CMD':"PREV"});
        console.log("PREV ouai ouai !");
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



    return comm;
};
    