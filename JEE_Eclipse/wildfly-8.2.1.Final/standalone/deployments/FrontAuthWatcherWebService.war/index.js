/**
 * Created by Stan on 17/11/2015.
 */
function clickme(){
    console.log("im clicked");
    $.post("/FrontAuthWatcherWebService/WatcherAuth", JSON.stringify({login: $("#login").val(), pwd: $("#pwd").val()}),
            function(data){
                console.log("success http");
                if(data.login !== undefined && data.role !== undefined){
                    console.log("login: " + data.login + " role: " + data.role);
                }
            });
}