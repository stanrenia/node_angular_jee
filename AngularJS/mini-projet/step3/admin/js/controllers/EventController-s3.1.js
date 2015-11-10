angular.module('adminApp').controller('eventCtrl',eventCrtlFnt);

eventCrtlFnt.$inject=['$scope','$log', '$window' , 'factory'];

function eventCrtlFnt($scope, $log, $window, factory){
    $scope.currentPresentation = factory.presentationCreation("FirstPres", "My first presentation");
    var slid_ct = 0, slide_img = 0;
    var imgs = ["img/Chad_Fullbring.jpg", "img/GuildWars2.jpg", "img/rio_saeba.jpg", ""];

    function init_fortest(){
        for(var i=0; i<4; i++)
            $scope.newSlide();
    }
    $scope.newSlide = function(){
        slid_ct++;
        var img_src = imgs[slide_img];
        slide_img++;

        var slide = factory.slidCreation("mySlide"+slid_ct, "myTxt");
        var content = factory.contentCreation("myContentTitle", "myType", img_src);
        if(slide_img >= 4)
            slide_img = 0;
        else
            slide.contentMap[content.id] = content;
        $scope.currentPresentation.slidArray.push(slide);

        if($scope.currentSlide == undefined)
            $scope.currentSlide = slide;
    };

    $scope.selectCurrentSlid=function(slide){
        $scope.currentSlide=slide;
    };
    $scope.isSlidContentEmpty=function(slid){
        var contentArray = factory.mapToArray(slid.contentMap);
        return(contentArray.length == 0);
    };

    init_fortest();
}