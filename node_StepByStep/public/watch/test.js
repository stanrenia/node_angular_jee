/**
 * Created by stan_ on 04/11/2015.
 */

    function test(){
        $.post("/savePres", JSON.stringify({
            id: "steph",
            slides: "enfant1-enfant2-slide3",
            autre: "test-soiree-e-ouf"
        }), function(data){
            console.log("save");
        })
    }
    

