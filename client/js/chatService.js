app.factory("chatService", ()=>{
	c = {
		socket : io(),
		connect : ()=>{
			c.socket.connect("/");	
		},
		getAllUsers : ()=>{
			c.socket.emit("getAllUsers", "allusers");
		},
		addUser : (login)=>{
			console.log(login);
			c.socket.emit("userName", login);
		},
		userAway : (login)=>{
			console.log("pass");
			c.socket.emit("userAway", login);
		},
		chatSend : (login, msg)=>{
			c.socket.emit("chatSend", {login: login, msg : msg});
		},
		isTyping : (login)=>{
			c.socket.emit("isTyping", {login : login});
		},
		cancelTyping : (login)=>{
			c.socket.emit("cancelTyping", {login: login});
		},
		close : ()=>{
			c.socket.emit("close", {});
		}
	}
	return {
		socket : c.socket,
		connect : ()=>{ c.connect();},
		getAllUsers : ()=>{ c.getAllUsers()},
		userAway : (login)=>{c.userAway(login)},
		addUser : (login)=>{ c.addUser(login)},
		chatSend : (login, msg) =>{ c.chatSend(login, msg)},
		isTyping : (login) =>{ c.isTyping(login)},
		cancelTyping : (login)=>{ c.cancelTyping(login)},
		close: ()=>{ c.close()}
	}
});
