angular.module('adminApp').controller('playerCtrl', playerCtrlFnt);

playerCtrlFnt.$inject=['$scope','$log','$window','factory','comm'];

function playerCtrlFnt($scope, $log, $window, factory, comm) {

    $scope.changeSlide = function(choice){
        var socket = $scope.socket;
        var curPres = $scope.currentPresentation;
        switch (choice){
            case "first":
                comm.io.emitBegin(socket);
                break;
            case "last":
                comm.io.emitEnd(socket); break;
            case "previous":
                comm.io.emitPrev(socket); break;
            case "next":
                comm.io.emitNext(socket); break;
            case "start":
                comm.io.emitStart(socket, curPres.id); break;
            case "pause":
                comm.io.emitPause(socket); break;
        }
    }
}

