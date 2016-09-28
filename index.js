//imports
var express = require("express");
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var bodyParser = require("body-parser");
var router = require("./server/route.js");
var utls = require("./server/utls.js");
//set && use
app.set("views", "./client");
app.set("view engine", "pug");
app.use(express.static("client"));
app.use(express.static("directives"));
app.use(express.static("node_modules"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(router);

//system
var array_user = [];
var array_pseudo = [];
var typing_user = [];
io.on("connection", (socket)=>{
	console.log("connection");
	io.emit("annoucements", {message : "A new user has joinded!"});
	socket.on("getAllUsers", (c)=>{
		io.emit("allUsers", {for:"everyone", message : {mail : array_user, user : array_pseudo}});
	});
	socket.on("userName", (c)=>{
		if(array_user.indexOf(c[0]) == -1){
			array_user.push(c[0]);
			array_pseudo.push(c[1]);
			io.emit("userAdded", {for: "everyone", message : {mail : c[0], user : c[1], id: array_user.indexOf(c[0])}});
			console.log(array_user);
			console.log(array_pseudo);
		}
	});
	socket.on("userAway", (c)=>{
		if(array_user.indexOf(c[0]) != -1){
			let index = array_user.indexOf(c[0]);
			io.emit("userGone", {for:"everyone", message : { id : index}});
			array_user.splice(index, 1);
			array_pseudo.splice(index,  1);
			socket.disconnect();
		}
	});
	socket.on("isTyping", (c)=>{
		if(utls.userInTypingObj(typing_user, c.login[0]) == false){
			typing_user.push({mail : c.login[0], user : c.login[1]});
		}
		io.emit("userTyping", {for : "everyone", message : {ul : typing_user}});
	});
	socket.on("cancelTyping", (c)=>{
		typing_user = utls.deleteTypingUse(typing_user, c.login[0]);
		io.emit("userCancelTyping", {for : "everyone", message : {ul : typing_user}});
	});
	socket.on("chatSend", (c)=>{
		io.emit("chatReceive", {for: "everyone", message : c});
	});
	socket.on("close", ()=>{
		socket.disconnect();
	});
	socket.on("disconnect", ()=>{
		io.emit("disconnection", {for : "everyone", message : "disconnected"});
	});
});
server.listen(8080, ()=>{
	console.log("Server launched on 8080");
});
