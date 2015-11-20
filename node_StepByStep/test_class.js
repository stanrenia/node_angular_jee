
function test_class(){
	

var slid =new SlidModel();
	
	slid.type = "pdf";
	setData("Documents de recherche");
	slid.id= "heetch28";
	slid.title ="Les fourmis";
	slid.filename = slid.id+".pdf";
	
	SlidModel.create(slid, function(err, data){
		console.log("create");
	});
	var test=SlidModel.read(slid.id, function(err, data){
		console.log("data");
	});
	console.log(test);
	
	var slid2=new SlidModel(null);
	slid2.type = "png";
	slid2.setData("Texte de recherche");
	slid2.id= "blablacar8";
	slid2.title ="Les réseaux de neuronnes";
	slid.filename = slid.id+".png";
	
	SlidModel.update(slid2, function(err, data){
		console.log(slid2);
		console.log(data);
	})
	
	SlidModel.suppr(slid2.id, function(err, data){
		console.log(data);
	})
	
}