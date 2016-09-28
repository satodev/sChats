let express = require("express");
let mg = require("./mongo.js");
let bodyParser = require("body-parser");
let r = express.Router();
mg.m.connection.on("error", (e)=>{
	console.log("Route error Hanlder");
	console.log(e);
	r.all("*",(req,res)=>{
		res.send("Error Server");
	});
});
r.get("/", (req, res)=>{
	res.render("index");
});
r.get("/user", (req, res)=>{
	let obj = {
		mail: (req.query.email) ? req.query.email : "",
		pseudo : (req.query.user ) ? req.query.user : "",
		mdp : (req.query.pwd) ? req.query.pwd : ""
	}
	mg.connect();
	if(obj.mail.length > 0 && obj.pseudo.length > 0 && obj.mdp.length > 0){
		mg.findOne({mail : obj.mail, pseudo : obj.pseudo, mdp : obj.mdp});
		mg.promise.then((data)=>{
			(data.length > 0) ? res.send("true") : res.send("false");
		}, (err)=>{
			console.log(err);	
		});
	}else if(obj.mail.length > 0 && obj.pseudo.length > 0 ){
		mg.findOne({mail : obj.mail, pseudo : obj.pseudo});
		mg.promise.then((data)=>{
			(data.length > 0) ? res.send("true") : res.send("false");
		}, (err)=>{
			console.log(err);	
		});
	}
	mg.disconnect();
});
r.get("/users", (req, res)=>{
	mg.connect();
	mg.findAll();
	mg.promise.then((data)=>{
		let array = [];
		data.map((cu,ci,res)=>{
			let str = cu.pseudo+" : "+cu.mail;
			array.push(str);
		});
		res.send(array);
	}, (err)=>{
		console.log(err);	
	});
	mg.disconnect();

});
r.post("/user", (req, res)=>{
	let obj = {
		mail : req.body.email,
		pseudo : req.body.user,
		mdp : req.body.pwd
	}
	mg.connect();
	let cuser = new mg.model({ pseudo : obj.pseudo, mail : obj.mail, mdp : obj.mdp });
	cuser.save((err)=>{
		if(err) console.log(err);
		res.send("user registered");
	});
	mg.disconnect();
});
module.exports = r;
