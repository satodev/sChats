app.factory("authFactory", ()=>{
	let a = {
		authProcess : (email, pseudo, pwd)=>{
			if(a.verifMailValid(email) && angular.isString(pseudo) && angular.isString(pwd)){
				return true;
			}else{
				return false;
			}
		},
		verifMailValid : (email)=>{
			let email_patt = /.*@.*\.[a-z]{0,4}/gi;
			if(angular.isString(email) && email_patt.exec(email) !== null){
				return true;
			}else{
				return false;
			}
		}
	}
	return {
		authProcess : (email, pseudo, pwd)=>{ return a.authProcess(email, pseudo, pwd);}
	}
});
