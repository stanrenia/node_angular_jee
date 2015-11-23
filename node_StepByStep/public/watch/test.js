/**
 * Created by stan_ on 04/11/2015.
 */

    function test(){
        $.post("/savePres", JSON.stringify({"type":"png","id":"blablablablacar8","title":"Les arbres de decision","filename":"arb_decision.png","data":"phot1-photo2-photo3"}), function(data){
            console.log("save");
        })
        
        $.post("/slids", JSON.stringify({"type":"txt","id":"slid1-Les réseaux Bayesiens","title":"Les réseau Bayesiens","filename":"res_Bayes.txt","data":"phot1-photo2-photo3"}), function(data){
            console.log("save");
        })
    }
    

