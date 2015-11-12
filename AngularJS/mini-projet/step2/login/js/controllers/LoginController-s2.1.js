angular.module('loginApp').controller('loginCtrl',loginCrtFnt);

loginCrtFnt.$inject=['$scope','$log', '$window' , 'auth'];

function loginCrtFnt($scope, $log, $window, auth){
	//TODO Init scope because clicking on button causes an error.
	$scope.logAuth = function() {
		$log.info('user login', $scope.user.login);
		$log.info('user pwd', $scope.user.pwd);
	};

	$scope.logAuthObject = function(user) {
	  $log.info('user login Obj', user.login);
	  $log.info('user pwd Obj', user.pwd);
	  var auth_response = auth.localAuthAsk(user.login, user.pwd);
	  auth_response.then(
	  	function(payload){
			$log.info("login success: "+ payload.user + " - Auth: " + payload.ValidAuth);
	  		$window.location.href = "loginSuccess.html";
	  	},
	  	function(err_payload){
	  		$log.warn("wrong login : " + err_payload.user + " - Auth: " + err_payload.ValidAuth);
	  	}
	  );
	};

	(function DisplayUserlist(){
		var usrlist = auth.userList();
		$log.info("** User list: **")
		for(var key in usrlist){
			$log.info("login: " + key + " -  pwd: " + usrlist[key].pwd);
		}
	})();
}