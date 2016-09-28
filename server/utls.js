utls = {
	userInTypingObj: (obj, key)=>{
		var isThere = false;
		for(var i = 0; i < obj.length; i++){
			if(obj[i].mail == key){
				isThere = true;	
			}
		}
		return isThere;
	},
	devareTypingUse : (obj, key)=>{
		for(var i = 0; i< obj.length; i++){
			if(obj[i].mail == key){
				obj.splice(i, 1);
			}
		}
		return obj;
	}
}
module.exports = utls
