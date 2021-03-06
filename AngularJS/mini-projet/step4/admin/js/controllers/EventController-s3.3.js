angular.module('adminApp').controller('eventCtrl',eventCrtFnt);

eventCrtFnt.$inject=['$scope','$log','$window','factory','comm'];

function eventCrtFnt($scope, $log, $window, factory, comm){

    $scope.currentPresentation=factory.presentationCreation("template_pres","description of the template présentation");
    
   //CREATE an object for interactions with ng-include controller
    $scope.contentMap={payload: "", array: []};
    $scope.presentationMap={payload: ""};
    $scope.hiddingDZ = true;
    $scope.socket = comm.io.socketConnection("", factory.generateUUID());

    var available_content=comm.loadImages('FirstPres');
       available_content.then(
          function(payload) { 
              $scope.contentMap.payload = payload;
              $scope.contentMap.array=factory.mapToArray(payload);
              console.log("array content: "  +  $scope.contentMap.array);
          },
          function(errorPayload) {
              $log.error('failure loading content', errorPayload);
          });
    
    var firstPresentation=comm.loadPres('FirstPres');
       firstPresentation.then(
          function(payload) { 
              $scope.presentationMap.payload= payload;
                            
              for(var key in $scope.presentationMap.payload){
                  $scope.currentPresentation[key] =$scope.presentationMap.payload[key];
              }
          },
          function(errorPayload) {
              $log.error('failure loading presentation', errorPayload);
          });
    
    
    $scope.newSlide=function(){
        var slid=factory.slidCreation("slide-Title","slide-text");
        $scope.currentPresentation.slidArray.push(slid);
        
    }
    
    $scope.savePres=function(){
        comm.savePres($scope.currentPresentation);
    }
    
    $scope.selectCurrentSlid=function(slide){
        $scope.currentSlide=slide;
        
    }
    
    
    $scope.onDragComplete=function(data,evt){
       console.log("drag success, data:", data);
    }
    
    
    $scope.onDropComplete=function(data,evt){
        if($scope.currentSlide != undefined){
            $scope.currentSlide.contentMap[1]= $scope.contentMap.payload[data.id];
            //needed to inform angular that a change occurred on the current variable, this fire an event change
             $scope.$apply();
            console.log("drop success, data:", data);
            }
    }
    
    $scope.getCurrentContent=function(){
        if(1  in  $scope.currentSlide.contentMap){
            return $scope.currentSlide.contentMap[1];
        }
    }
    
    $scope.isSlidContentEmpty=function(slid){
        if(slid.contentMap[1]== undefined){
            return true;
        }
        return false
    }    

    $scope.hideDropZone = function(){
        $scope.hiddingDZ = !$scope.hiddingDZ;
    }


};
