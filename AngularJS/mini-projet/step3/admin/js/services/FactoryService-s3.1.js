var contentType={};
contentType.IMG_URL="IMG_URL";
contentType.IMG_B64="IMG_B64";

angular.module('factoryServices', []).factory('factory',factoryFnc);
function factoryFnc(){
	var factory = {
		generateUUID:
			generateUUID,
		contentCreation:
			contentCreation,
		slidCreation:
			slidCreation,
		presentationCreation: presentationCreation,
		mapToArray:
			mapToArray
	};
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	function generateUUID(){
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

	function contentCreation(title,type,src){
		/* Content Id title src type*/
		return {id: generateUUID(), title: title, src: src, type: type};
	}
	function slidCreation(title,txt){
		return {id: generateUUID(), title: title, txt: txt, contentMap: {}};
	}
	function presentationCreation(title,description){
		return {id: generateUUID(), title: title, description: description, slidArray: []};
	}
	function mapToArray(map){
		var contentArray=[];
		for(var key in map){
			contentArray.push(map[key]);
		}
		return contentArray;
	}
	return factory;
}
