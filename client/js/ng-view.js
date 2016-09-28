app.directive("home", ()=>{
	return {
		templateUrl : "home.html",
		controller : "mainCont"
	}
});
app.directive("chat", ()=>{
	return {
		templateUrl: "chat.html",
		controller : "chatCont"
	}
});
