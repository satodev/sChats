app.config(["$locationProvider", "$routeProvider", ($locationProvider, $routeProvider)=>{
	$locationProvider.hashPrefix("!");
	$routeProvider.
		when("/", {
			template : "<home></home>"
		}).
		when("/chat", {
			template : "<chat></chat>"
		}).
		otherwise("/");
}]);
