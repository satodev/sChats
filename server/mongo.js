let mg = require("mongoose");
let u = "sato";
let m = "sato4591";
let assert = require("assert");
let mo = {
	schema : "",
	model : "",
	cuser :  "",
	co: "",
	query : "",
	promise : "",
	m : mg, 
	connect : ()=>{
		mo.co= mg.connect("mongodb://"+u+":"+m+"@ds035786.mlab.com:35786/schat");
		mg.Promise = global.Promise;
	},
	disconnect : ()=>{
	//	mo.co.disconnect();
		mg.connection.close();
	},
	initSchema : ()=>{
		mo.schema = mg.Schema({
			pseudo : String,
			mail : String,
			mdp : String,
		});
	},
	initModel :()=>{
		mo.model = mg.model("users", mo.schema);
	},
	createDoc :(pseudo, mail, mdp)=>{
		if(pseudo && mail && mdp){
			mo.query = mo.model.create({ pseudo : pseudo, mail : mail, mdp : mdp }, (err, data)=>{
				if(err) console.log(err);
				mo.cuser = data;
			});
			//mo.promise = mo.query.exec();
			//assert.equal(mo.query.exec().constructor, global.Promise);
		}
	},
	save : ()=>{
		mo.query = mo.cuser.save();
		mo.promise = mo.query.exec();
		assert.equal(mo.query.exec().constructor, global.Promise);
	},
	findAll : ()=>{
		mo.query = mo.model.find();
		mo.promise = mo.query.exec();
		assert.equal(mo.query.exec().constructor, global.Promise);
	},
	findOne : (filter)=>{
		mo.query = mo.model.find(filter);
		mo.promise = mo.query.exec();
		assert.equal(mo.query.exec().constructor, global.Promise);
	}
}
mo.initSchema();
mo.initModel();
module.exports = mo;
