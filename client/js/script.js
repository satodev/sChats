let app = angular.module("sChat", ["ngRoute"]);
app.controller("mainCont", ["$scope", "$http", "$location", "authFactory", "chatService", ($scope, $http, $location, authFactory, chatService)=>{
	($scope.login_info && $scope.login_info.length > 0) ? chatService.userAway($scope.login_info) : "";
	let sStore = {
		obj : window.sessionStorage,
		add : (name, value)=>{sStore.obj.setItem(name,value)},
		clear : ()=>{sStore.obj.clear()},
		get : (name)=>{return sStore.obj.getItem(name)}
	}
	document.onreadystatechange = function(){
		if(document.readyState == "complete"){
			let mail = sStore.get("user_email"); 
			let name = sStore.get("user_name");
			$scope.login_info = (mail && name && mail.length > 0 && name.length > 0) ? [mail, name] : null;
			//($scope.login_info && $scope.login_info.length > 0) ? chatService.userAway($scope.login_info) : "";
		}
	}
	$scope.disconnect = ()=>{
		chatService.close();
		$scope.login_info = "";
		sStore.clear();
		$location.path("#!/");
	}
	$scope.getAllUser = function(){
		$scope.loading = "loading";
		$http.get("/users").then((res)=>{
			$scope.loading = "";
			if(res){
				let user = document.getElementById("user");
				user.innerHTML = "";
				for(var i = 0; i < res.data.length; i++){
					user.innerHTML += "<p>"+res.data[i]+"</p>";
				}
			}
		});
	}
	$scope.loginProcess = function(email, user, pwd){
		$scope.login_error = "";
		$scope.loading = "loading";
		if(authFactory.authProcess(email, user, pwd)){
			let config = {params: {email : email, user : user, pwd : pwd}};
			$http.get("/user", config).then((res)=>{
				if(res.data =="true"){
					$scope.login_info = [email, user];
					sStore.add("user_email", email);
					sStore.add("user_name", user);
					//chatService.connect();
				}else{
					$scope.login_error = "problem while login";
				}
			}, (error)=>{
				$scope.login_error = "Error : Server Problem";	
			}).finally(()=>{
				$scope.loading ="";	
			});
		}else{
			$scope.loading = "";
			$scope.login_error = "Wrong inputs";
		}
	}
	$scope.authProcess = function(email, pseudo, pwd){
		$scope.auth_error = "";
		$scope.loading = "loading";
		if(email && pseudo && pwd ){
			if(authFactory.authProcess(email, pseudo, pwd)){
				let config = {params: {email : email, user: pseudo}};
				$http.get("/user", config).then((res)=>{
					console.log(res);
					if(res.data == "false"){
						$http.post("/user", {email : email, user : pseudo, pwd : pwd}).then((response)=>{
							console.log(response);
							if(response){
								$scope.auth_error = "User registered";
							}else{
								$scope.auth_error = "Problem  : couldn't register";
							}
						}, (error)=>{
							$scope.auth_error = "Error : Server Problem";	
						}).finally(()=>{
							$scope.loading = "";		
						});
					}else{
						$scope.loading = "";
						$scope.auth_error = "User already exists";
					}
				});
			}else{
				$scope.loading = "";
				$scope.auth_error = "Wrong inputs value";
			}

		}else{
			$scope.loading = "";
			$scope.auth_error = "All inputs are required";
		}
	}
}]);
