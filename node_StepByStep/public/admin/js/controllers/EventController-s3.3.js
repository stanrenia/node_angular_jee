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

    // inputs controllers
    $scope.selectsActive = {pres: true}; // true if we can change presentation using the select html element

    // view variables
    $scope.hiddingDZ = true;
    $scope.isCreatingPres = false;

    $scope.forceReloging = function(){
        $window.localStorage.setItem("forcingLoging", true);
        $window.location.href = "/login/index.html";
    }

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
                    // Get the first presentation of the map
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

    $scope.newSlide=function(){
        var slid=factory.slidCreation("slide-Title","slide-text");
        $scope.currentPresentation.slidArray.push(slid);
        
    }

    $scope.newPres=function(){
        var pres =  factory.presentationCreation($scope.in_pres.title, $scope.in_pres.desc);
        $scope.presentationMap.payload[pres.id] = pres;
        $scope.presentationMap.array = factory.mapToArray($scope.presentationMap.payload);
    }

    $scope.activeNewPres=function(){
        $scope.isCreatingPres = !$scope.isCreatingPres;
    }

    $scope.savePres=function(){
        var savingPres = comm.savePres(idToken, $scope.currentPresentation);
        savingPres.then(
            function () {
                $scope.presentationMap.payload[$scope.currentPresentation.id] = $scope.currentPresentation;
                $scope.presentationMap.array = factory.mapToArray($scope.presentationMap.payload);
            },
            function(){
                console.warn("SERVER COULD NOT SAVE THE PRESENTATION");
            }
        );
    }
    
    $scope.selectCurrentSlid=function(slide){
        $scope.currentSlide=slide;
        
    }
    
    
    $scope.onDragComplete=function(data,evt){
       console.log("drag success, data:", data);
    }
    
    
    $scope.onDropComplete=function(data, evt){
        if($scope.currentSlide != undefined){
            $scope.currentSlide.contentMap[1]= data.id;
            //needed to inform angular that a change occurred on the current variable, this fire an event change
            //$scope.$apply();
            console.log("drop success, data:", data);
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

    $scope.hideDropZone = function(){
        $scope.hiddingDZ = !$scope.hiddingDZ;
    }
};
