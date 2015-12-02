//var fs =require("fs");
//var CONFIG = require("./config.json");

var SlidModel=function (smodel){

	smodel=check_attr(smodel);
//	console.log("class slid.model.js:"+smodel.type);
	this.id=smodel.id;
	this.type=smodel.type;
	this.title=smodel.title;
	this.filename=smodel.filename;
	var data=smodel.data;

	this.setData=function (data1){
		if (data1 === "undefined") {return -1;}
		this.data=data1;
	}

	this.getData=function(smodel){
		if (smodel === "undefined") {return -1;}
		return smodel.data;
	}
	
	function check_attr(smodel){
        if(typeof smodel === "undefined")
        {
        	smodel={type: null, id: null, title: null, filename: null, data: null};
        }
        else{
            if(typeof smodel.type === "undefined")
                smodel["type"]=null;
            if(typeof smodel.id === "undefined")
                smodel["id"]=null;
			if(typeof smodel.title === "undefined")
                smodel["title"]=null;
			if(typeof smodel.filename === "undefined")
                smodel["filename"]=null;
			if(typeof smodel.data === "undefined")
                smodel["data"]=null;
        }
        return smodel;
    }
}

SlidModel.create=function(smodel, callback){
	var fs =require("fs");
	var CONFIG = JSON.parse(process.env.CONFIG);
	var metadata_path = CONFIG.contentDirectory + "/" +smodel.id +".meta.json";
	var filename_path = CONFIG.contentDirectory + "/" +smodel.filename;
	var string_content = JSON.stringify(smodel);
	
	fs.writeFile(filename_path, smodel.data, function(err) {
        if(err) {
          return callback(err);
        } else {
          console.log("Data:"+smodel.data+" saved to " + filename_path);     
          fs.writeFile(metadata_path, string_content, function(err) {
              if(err) {
            	 return callback(err);
              } else {
                console.log("meta:"+string_content+" saved to " + metadata_path);
              }
              callback(null, smodel);
          });
        }
    });
}

SlidModel.read=function(id, callback){
	var fs =require("fs");
	var CONFIG = JSON.parse(process.env.CONFIG);

//	var slidmodel= new SlidModel();
	var slid_path=CONFIG.contentDirectory + "/" +id +".meta.json";
	fs.readFile(slid_path, function (err, data) {
		  //utils.js
		  if (err) return callback(err);
		  
		  //console.log("dans le read:"+data);
		  data=data.toString();
		  data_json=JSON.parse(data);
		  var slid_ret = new SlidModel(data_json);
//		  SlidModel.type = data_json.type;
//		  SlidModel.setData(data,data_json.data);
//		  SlidModel.filename=data_json.filename;
//		  SlidModel.id=data_json.id;
//		  SlidModel.title=data_json.title;
		  //appeler constructeur
		 // console.log("résultat:"+JSON.stringify(slidmodel));
		  callback(null, JSON.stringify(slid_ret));
		});
}

SlidModel.update=function(slid, callback){
	SlidModel.read(slid.id,function(err, slid_lu){
		if(err) return callback(err);
		
		console.log("dans le update, slid.data non null");
		SlidModel.create(slid, function(err, data2){	
			if(err) return callback(err);	
			console.log(data2);
			callback(null, JSON.stringify(slid_lu));
		});
	});
}

SlidModel.suppr=function(id, callback){
	 var fs =require("fs");
	 var CONFIG = JSON.parse(process.env.CONFIG);
	 
	 SlidModel.read(id, function(err, data){
		if(err) return callback(err);
		var slid_lu =JSON.parse(data);
		console.log("id:"+slid_lu.id);

		fs.unlink(CONFIG.contentDirectory + "/"+slid_lu.filename,function(data, err){
		console.log("rmdir filename");
		fs.unlink(CONFIG.contentDirectory + "/" + slid_lu.id +".meta.json", function(data,err){
			console.log("rmdir meta json");
			callback();
			});
		});
		
      
	} );
}

module.exports = SlidModel;