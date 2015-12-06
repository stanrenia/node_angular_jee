angular.module('loginApp').controller('loginCtrl',loginCrtFnt);

loginCrtFnt.$inject=['$scope','$log', '$window' , 'auth'];

function loginCrtFnt($scope, $log, $window, auth){

    $scope.errMsg = "";
    if($window.localStorage.getItem("forcingLoging")){
        $scope.errMsg = "You must be logged";
        $window.localStorage.removeItem("forcingLoging");
    }

    $scope.logAuthObject = function(user) {
        $log.info("Trying to login");
        var auth_response = auth.authAsk(user.login, user.pwd);
        auth_response.then(
            function(payload){
                $log.info("login success: " + JSON.stringify(payload));

                if(payload.user.id !== undefined){
                    $window.localStorage.setItem("idtoken", payload.user.id);
                    $window.location.href = payload.page;
                }
            },
            function(err_payload){
                $scope.errMsg = "Wrong login";
                $log.warn("wrong login: " + err_payload.msg);
            }
        );
    };
}