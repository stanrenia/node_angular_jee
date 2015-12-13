angular.module('adminApp').controller('eventCtrl',eventCrtFnt);

eventCrtFnt.$inject=['$scope','$log','$window','factory','comm'];

function eventCrtFnt($scope, $log, $window, factory, comm){

    //$scope.currentPresentation=factory.presentationCreation("template_pres","description of the template présentation");
   //CREATE an object for interactions with ng-include controller
    $scope.contentMap={payload: "", array: []};
    $scope.presentationMap={payload: "", array: []};

    //$scope.presentationMap={payload: ""};

    var idToken = $window.localStorage.getItem("idtoken");
    $scope.socket = comm.io.socketConnection($scope, idToken);

    $scope.forceReloging = function(){
        $window.localStorage.setItem("forcingLoging", true);
        $window.location.href = "/login/index.html";
    }

    function load_init_Content(){
        var available_content=comm.loadImages();
        available_content.then(
            function(payload) {
                $scope.contentMap.payload = payload;
                $scope.contentMap.array=factory.mapToArray(payload);
                console.log("array content: "  +  $scope.contentMap.array);
            },
            function(errorPayload) {
                $log.error('failure loading content', errorPayload);
            });
    }
    load_init_Content();

    function load_init_Pres(pres_id){
        var firstPresentation=comm.loadPres();
        firstPresentation.then(
            function(payload) {
                $scope.presentationMap.payload = payload;
                $scope.presentationMap.array = factory.mapToArray(payload);
                if(pres_id !== undefined){
                    if(payload[pres_id] !== undefined)
                        $scope.currentPresentation = $scope.presentationMap.payload[pres_id];
                    else
                        console.error("Server sent incoherent data");
                }
                else{
                    //TODO GET DEFAULT PRESENTATION
                    for(var key in payload){
                        $scope.currentPresentation = $scope.presentationMap.payload[key];
                        break;
                    }
                }
                $scope.currentSlide = $scope.currentPresentation.slidArray[0];
            },
            function(errorPayload) {
                $log.error('failure loading presentation', errorPayload);
            });
    }
    load_init_Pres();

    $scope.update_content = function(pres_id, slide){
        if(!pres_id) return;
        if($scope.presentationMap.payload[pres_id] === undefined){
            if(pres_id == 1) pres_id = $scope.currentPresentation.id;
            load_init_Content();
            load_init_Pres(pres_id);
        }
        else{
            if($scope.currentPresentation.id !== pres_id){
                $scope.currentPresentation = $scope.presentationMap.payload[pres_id];
            }
            $scope.currentSlide = slide;
            $scope.$apply();
        }
    }
    
    $scope.getCurrentContent=function(){
        if(1  in  $scope.currentSlide.contentMap){
            return $scope.currentSlide.contentMap[1];
        }
    }
    
    $scope.isSlidContentEmpty=function(slid){
        if(slid == undefined) return false;
        return slid.contentMap[1]== undefined;
    }
};
