//var fs =require("fs");
//var CONFIG = require("./config.json");

module.exports = function SlidModel(smodel){
	
	var fs =require("fs");
	var CONFIG = JSON.parse(process.env.CONFIG);
	
	smodel=check_attr(smodel);
//	console.log("class slid.model.js:"+smodel.type);
	
	this.type=smodel.type;
	this.id=smodel.id;
	this.title=smodel.title;
	this.filename=smodel.filename;
	this.data=smodel.data;
	
	function check_attr(smodel){
        if(typeof smodel === "undefined")
        {
        	smodel={type: "slid", id:"blablablablacar8", title:"Arbres de décis", filename:"arb_decision", data:"slid1-slid2-slid3"};
        }
        else{
            if(typeof smodel.type === "undefined")
                smodel["type"]="slid";
            if(typeof smodel.id === "undefined")
                smodel["id"]="blablablablacar8";
			if(typeof smodel.title === "undefined")
                smodel["title"]="Arbres de décisions";
			if(typeof smodel.filename === "undefined")
                smodel["filename"]="arb_decision";
			if(typeof smodel.data === "undefined")
                smodel["data"]="slid1-slid2-slid3";
        }
        return smodel;
    }
	
	this.setData=function (data1){
		if (data1 === "undefined") {return -1;}
		this.data=data1;
	}

	this.getData=function(smodel){
		if (smodel === "undefined") {return -1;}
		return smodel.data;
	}



	this.create=function(smodel, callback){
		
		var metadata_path = CONFIG.presentationDirectory + "/" +smodel.id +".meta.json";
		var string_content = JSON.stringify(smodel);
		
		fs.writeFile(smodel.filename, smodel.data, function(err) {
	        if(err) {
	          console.log(err);
	        } else {
	          console.log("Data:"+smodel.data+" saved to " + smodel.filename);     
	        }
	    });  
		
		fs.writeFile(metadata_path, string_content, function(err) {
	        if(err) {
	          console.log(err);
	        } else {
	          console.log("meta:"+string_content+" saved to " + metadata_path);
	        }
	    });
		
		callback(smodel);
	}

	this.read=function(id, callback){
		var slidmodel= new SlidModel();
		var slid_path=CONFIG.presentationDirectory + "/" +id +".meta.json";
		fs.readFile(slid_path, function (err, data) {
			  
			  if (err) throw err;
			  
			  console.log("dans le read:"+data);
			  
			  data_json=JSON.parse(data);
			  
			  slidmodel.type = data_json.type;
			  slidmodel.setData(data_json.data);
			  slidmodel.filename=data_json.filename;
			  slidmodel.id=data_json.id;
			  slidmodel.title=data_json.title;
			  
			 // console.log("résultat:"+JSON.stringify(slidmodel));
			  
			  callback(JSON.stringify(slidmodel));
			});
		
		
		
	}
		

	this.update=function(slid, callback){
		
		
		slid.read(slid.id,function(data1){
			console.log("dans le read"+data1);
			if(slid.data != "null" && slid.data.length > 0){
				console.log("dans le update, slid.data non null");
				slid.create(slid, function(data2){	
					console.log(data2);
				});
			}
			else{
				console.log("slid.data --> null ou taille <=0");
			}
			
			callback(slid);
		});
		
		
	}
	
	this.suppr=function(id, callback){
		
		 this.read(id, function(err, data){
			if(err) {
	            console.log(err);
	          } else {
			console.log(data);
			
			data.data.remove();
			data.filename.remove();
	          }
		} );
	}
}
