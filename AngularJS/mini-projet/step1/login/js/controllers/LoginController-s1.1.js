angular.module('loginApp').controller('loginCtrl',loginCrtFnt);

loginCrtFnt.$inject=['$scope','$log'];

function loginCrtFnt($scope, $log){
	//TODO Init scope because clicking on button causes an error.
	$scope.logAuth = function() {
		$log.info('user login', $scope.user.login);
		$log.info('user pwd', $scope.user.pwd);
	};

	$scope.logAuthObject = function(user) {
	  $log.info('user login Obj', user.login);
	  $log.info('user pwd Obj', user.pwd);
	  // user.login = "bobo";
	  // $log.info('After update. user login Obj', user.login);
	};
}