angular.module('commServices', ['factoryServices']).factory('comm',commFnc);
commFnc.$inject=['$http','$q','factory'];

function commFnc($http,$q, factory){
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
    }

    var comm = {
         loadImages:       loadImages,
         loadPres:          loadPres,
         savePres:      savePres
     };

    function loadImages(presName, presID){
        var deferred = $q.defer();

        /*if(typeof presName === "undefined") deferred.reject("error given parameters are incorrect");
        if(typeof presID !== "undefined")
            var pres = loadPres("", presID);
        else
            var pres = loadPres(presName);*/

        setTimeout(function(){
            deferred.resolve(contentMap);
        }, 2000);

        return deferred.promise;
    }

    function loadPres(presName, presID){
        var deferred = $q.defer();
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
        return deferred.promise;
    }

    function savePres(){

    }

    return comm;
};
    