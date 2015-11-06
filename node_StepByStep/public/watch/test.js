/**
 * Created by stan_ on 04/11/2015.
 */

    function test(){
        $.post("/savePres", {
            id: "blablacarPres",
            slides: "[slides]"
        }, function(data){
            console.log("save");
        })
    }
