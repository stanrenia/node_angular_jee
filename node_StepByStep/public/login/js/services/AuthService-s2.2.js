angular. module ('authService', []).service('auth',authFnc);
authFnc.$inject=['$http','$q'];
function authFnc($http,$q) {

    function authAsk(login, pwd){
        var deferred = $q.defer();
        $http.post('/fakeauth', {login:login, pwd:pwd})
            .success(function(data) {
                deferred.resolve({"user":data.user, page: data.page, "validAuth": true, msg: ""});
            })
            .error(function(data) {
                var msg = "";
                if(data && data.msg)
                    msg = data.msg;
                deferred.reject({"user":{},"ValidAuth": false, msg: msg});
            });
        return  deferred.promise;
    }

    function User(login, pwd, role, surname){
        if(typeof login === "undefined" || login === "")
            login = "guest";
        if(typeof surname === "undefined")
            surname = "";
        if(typeof pwd === "undefined"  || pwd === "")
            pwd = "guest";
        if(typeof role === "undefined"  || ["watcher", "admin"].indexOf(role.toLowerCase()) == -1)
            role = "watcher";
        return {login: login, pwd: pwd, role: role, surname: surname};
    }

	return {
        authAsk: authAsk,
        User: User
    };
}