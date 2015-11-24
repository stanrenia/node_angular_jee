angular.module('adminApp').controller('eventCtrl',eventCrtFnt);

eventCrtFnt.$inject=['$scope','$log','$window','factory','comm'];

function eventCrtFnt($scope, $log, $window, factory, comm){

    $scope.currentPresentation=factory.presentationCreation("template_pres","description of the template présentation");
    
   //CREATE an object for interactions with ng-include controller
    $scope.contentMap={payload: "", array: []};
    $scope.presentationMap={};
    //$scope.presentationMap={payload: ""};
    $scope.hiddingDZ = true;
    $scope.socket = comm.io.socketConnection($scope, factory.generateUUID());

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
    
    var firstPresentation=comm.loadPres();
       firstPresentation.then(
          function(payload) {
              $scope.presentationMap = payload;
              for(var key in $scope.presentationMap){
                  $scope.currentPresentation = $scope.presentationMap[key];
                  $scope.currentSlide = $scope.currentPresentation.slidArray[0];
                  break;
              }
              /*$scope.presentationMap.payload= payload;
              for(var key in $scope.presentationMap.payload){
                  $scope.currentPresentation[key] =$scope.presentationMap.payload[key];
              }*/
          },
          function(errorPayload) {
              $log.error('failure loading presentation', errorPayload);
          });
    
    
    $scope.newSlide=function(){
        var slid=factory.slidCreation("slide-Title","slide-text");
        $scope.currentPresentation.slidArray.push(slid);
        
    }
    
    $scope.selectCurrentSlid=function(slide){
        $scope.currentSlide=slide;
        
    }

    $scope.getCurrentContent=function(){
        if(1  in  $scope.currentSlide.contentMap){
            return $scope.currentSlide.contentMap[1];
        }
    }
    
    $scope.isSlidContentEmpty=function(slid) {
        return slid.contentMap[1] == undefined;
    }
}
