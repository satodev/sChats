app.controller("chatCont", ['$scope', "$http", "$location", "chatService", ($scope, $http, $location, chatService)=>{
	if($scope.login_info && $scope.login_info.length > 0){

		let body = document.getElementsByTagName("body")[0];
		let socket = chatService.socket;
		let chatBox = document.getElementById("message");
		let message = document.getElementById("msg");
		let submit = document.getElementById("submit");
		let nickname = document.getElementById("nickname");
		let list_user = document.getElementById("list_user");
		let user_co = document.getElementsByClassName("user_connected")[0];
		let user_id = document.getElementsByClassName("user_id");
		let array_pseudo = [];
		let array_mail = [];

		chatService.connect();
		chatService.getAllUsers();
		chatService.addUser($scope.login_info);

		body.onbeforeunload = ()=>{
			chatService.userAway($scope.login_info);
			chatService.close();
		};
		message.onkeyup = (e)=>{
			chatService.isTyping($scope.login_info);
			
			if(message.value.length == 0){
				chatService.cancelTyping($scope.login_info);	
			}
			if(e.which == "13" && e.isTrusted){ // event on "enter" key 
				if(message.value.length > 0){
					chatService.chatSend($scope.login_info, message.value);	
					chatService.cancelTyping($scope.login_info);
					message.value = "";
				}
			}
		}
		submit.onclick = ()=>{
			if(message.value.length > 0){
				chatService.chatSend($scope.login_info, message.value);		
				chatService.cancelTyping($scope.login_info);
				message.value = "";
			}
		};
		socket.on("allUsers", (data)=>{
			user_co.innerHTML = "";
			array_mail = data.message.mail;
			array_pseudo = data.message.user;
			for(var i = 0; i < array_mail.length; i++){
				user_co.innerHTML += "<p class='user_id' id="+i+">"+array_pseudo[i]+"</p>";
			}
		});
		socket.on("userGone", (data)=>{
			id = data.message.id;
			if(data.message){
				let p = document.getElementsByClassName("user_connected")[0];
				let id_cont = document.getElementById(id);
				if(p && id_cont){
					p.removeChild(id_cont);
				}
			}
		});
		socket.on("chatReceive",(data)=>{
			console.log(data);
			chatBox.innerHTML += "<p class='chatmsg'>"+data.message.login[1] + " : "+data.message.msg+"</p>";	
		});
		socket.on("userTyping", (data)=>{
			let users = [];
			let obj = data.message.ul;
			for(var i = 0 ; i < obj.length; i++){
				if(obj[i].user != $scope.login_info[1]){
					users.push(obj[i].user);
				}
			}
			let ul = users.join(",");
			let cont_type = document.getElementById("typing");
			if(users.length > 1){
				cont_type.innerHTML = ul + " are typing";
			}else if(users.length == 1){
				cont_type.innerHTML = ul + " is typing";
			}else{
				cont_type.innerHTML = "";
			}
		});
		socket.on("userCancelTyping", (data)=>{
			let d = data.message.ul;
			let list_user = [];
			let cont_type = document.getElementById("typing");
			for(var i = 0; i < d.length; i++){
				list_user.push(d[i].user);
			}
			if(list_user.length > 0){
				if(list_user.length > 1){
					cont_type.innerHTML = list_user.join(",") + " are typing";
				}else{
					cont_type.innerHTML = list_user.join(",") + " is typing";
				}
			}else{
				cont_type.innerHTML = "";
			}
		});
		socket.on("annoucements", (data)=>{
			//socket.emit("userName", $scope.login_info);
			//chatBox.innerHTML += "<p class='chatmsg'>"+data.message+"</p>";
		});
		socket.on("userAdded", (data)=>{
			let id = data.message.id;
			let user = data.message.user;
			let verifState = false;
			for(var i = 0; i < user_id.length; i++){
				console.log(user_id[i]);
				let uid = user_id[i].getAttribute("id");
				console.log(uid);
				if(uid == id){
					verifState = true;
				}else{
					verifState = false;
				}
			}
			if(!verifState){
				user_co.innerHTML += "<p class='user_id' id="+id+">"+user+"</p>";
			}
		});
		socket.on("disconnection", (data)=>{
			//handle that 
		});
	}else{
		$location.path("/");
	}
}]);
