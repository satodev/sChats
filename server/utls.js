utls = {
	userInTypingObj: (obj, key)=>{
		let isThere = false;
		for(var i = 0; i < obj.length; i++){
			if(obj[i].mail == key){
				isThere = true;	
			}
		}
		return isThere;
	},
	deleteTypingUse : (obj, key)=>{
		for(var i = 0; i< obj.length; i++){
			if(obj[i].mail == key){
				obj.splice(i, 1);
			}
		}
		return obj;
	}
}
module.exports = utls
