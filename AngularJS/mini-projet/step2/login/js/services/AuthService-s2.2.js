angular. module ('authService', []).service('auth',authFnc);
authFnc.$inject=['$http','$q'];
function authFnc($http,$q) {
	var userMap={};
	userMap['jdoe'] = {pwd: 'jdoepwd', role: "admin"};
	userMap['psmith'] = {pwd: 'psmithpwd', role: "admin"};
	userMap['tp'] =  {pwd: 'tp', role: "admin"};

	var fncContainer={
		localAuthAsk:localAuthAsk,
		userList: userList
	};
	function localAuthAsk(login,pwd){
		var deferred = $q.defer();
		setInterval(function(login,pwd){
			if( typeof userMap[login] !== "undefined" && userMap[login].pwd == pwd){
				deferred.resolve({"user":userMap[login],"ValidAuth": true});
			}else{
				deferred.reject({"user":userMap[login],"ValidAuth": false});
			}
			clearInterval(this);
		}, 3000, login, pwd);
	return deferred.promise;
	}

	function userList(){
		return userMap;
	}
	return fncContainer;
}