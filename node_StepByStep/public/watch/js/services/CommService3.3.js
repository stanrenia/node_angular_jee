angular.module('commServices', ['factoryServices']).factory('comm',commFnc);
commFnc.$inject=['$http','$q','factory'];

function commFnc($http,$q, factory){
    var comm = {
         loadImages:       loadImages,
         loadPres:          loadPres
     };

    function loadImages(){
        var deferred = $q.defer();

       /* // FOR LOCAL TEST
        setTimeout(function(){
            deferred.resolve(contentMap);
        }, 500);*/

        // FOR RELEASE
        $http.get("/slids")
            .success(function(data){
                if(data)
                    deferred.resolve(data);
                else
                    deferred.reject();
            })
            .error(function(data){
                deferred.reject();
            });
        return deferred.promise;
    }

    function loadPres(presID){
        var deferred = $q.defer();
        // FOR LOCAL TEST
        $http.get("/loadPres", {params: {"presid": presID}})
            .success(function(data){
                if(data)
                    deferred.resolve(data);
                else
                    deferred.reject();
            })
            .error(function(data){
                deferred.reject();
            });
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

            socket.on('currentSlidEvent', function (data) {
                if(data.slid && data.pres_id){
                    if(data.slid != -1) // only on the admin side
                    {
                        scope.update_content(data.pres_id, data.slid);
                    }
                    // else: the slide did not change because its in the first or last position.
                }
            });

            socket.on('errorClient', function (data) {
                if(data)
                    console.warn(data);
                //if(data.content && data.content !== null)
            });

            socket.on("disconnect", function(){
               scope.forceReloging();
            });
            return socket;
        }
    }
    else console.warn("io is undefined");

    return comm;
}
    