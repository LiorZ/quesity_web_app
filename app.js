var express = require('express');
var app = express();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var _ = require('underscore');
var models = {};
models.Quest = require('./models/Quest')(mongoose);
models.Account = require('./models/Account')(mongoose,models.Quest);
		app.configure(function(){
	console.log("Configuring ... ");
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.limit('1mb'));
	app.use(express.cookieParser());
	app.use(express.session({secret: "Lior&Tomer", store: new MemoryStore()}));
	
	mongoose.connect('mongodb://localhost/quesity');
});

var generic_error = function(err) {
	console.log(err);
	res.send(401);
}
app.post('/quest/:q_id/new_page',function(req,res) { 
	if ( req.session.loggedIn ) {
		var account_id = req.session.accountId;
		var quest_id = req.param('q_id');
		var new_page_callback = function(new_page){
			res.send({_id: new_page._id});
		};
		models.Quest.validate_quest_to_account({accountId:account_id,quest_id:quest_id},function(model) {
			if ( model == null || model == undefined ){
				res.send(401);
			}else {
				models.QuestPage.new_page({
					x:req.param('x'),
					y:req.param('y'),
					page_name:req.param('page_name'),
					page_type: req.param('page_type'),
					page_number: req.param('page_number'),
					page_content:req.param('page_content')
				},new_page_callback,generic_error);
			}
		},generic_error);
	}else { 
		res.send(401);
	}
	});
		
app.get('/editor/:q_id', function(req, res){
	if ( req.session.loggedIn ) {
		var account_id = req.session.accountId;
		var quest_id = req.param('q_id');
		models.Quest.validate_quest_to_account(account_id,quest_id,function(model) {
			res.render("editor.jade",{layout:false, quest_id: quest_id});
		},generic_error);
	}
	else{
		res.redirect('/');
	}
});

app.get('/', function(req, res){
	res.render("index.jade", {layout:false,booter: 'main_site/js/boot'});
});

app.get('/quest/:q_id',function(req,res){
	if ( req.session.loggedIn) {
		var account_id = req.session.accountId;
		var quest_id = req.param('q_id');
		
		models.Quest.validate_quest_to_account(account_id,quest_id,
				function(quest){
					console.log("Sending quest: " + quest);
					res.send(quest);
				},
				generic_error
		);
	}
});

app.post('/new_quest',function(req,res) { 
	if (req.session.loggedIn) {
		var account_id = req.session.accountId;
		var title = req.param('title','');
		models.Quest.create_new({title:title,accountId:account_id},function(quest){console.log("Created quest " + quest ); res.send({_id:quest._id});}, function(err) { console.log(err); res.send(401); })
	}else {
		res.send(401);
	}
});

app.post('/register' , function(req,res) { 
	console.log("Trying to register ... ");

	var first_name = req.param("firstName",null);
	var last_name = req.param("lastName",null);
	var email = req.param("email",null);
	var password = req.param("password",null);
	
	models.Account.register(email,password, first_name, last_name);	
	console.log("Registration completed");
	res.send(200);
});

app.get('/account/me', 
		function(req,res) {
			if (req.session.loggedIn ) {
				console.log("User is logged in");
				models.Account.byId(req.session.accountId, function(account) {
					res.send(account);
				},
				function(err) {console.log(err); res.send(401);}
				);
			} else {
				res.send(401);
			}
			
});

app.post('/login', function(req,res) { 

	var username = req.param('email',null);
	var password = req.param('password',null);
	
	
	if (username == null || password == null || username.length < 1 || password.length < 1 ) {
		res.send(401);
		return;
	}
	models.Account.login(username,password,function(account){
		if (!account) {
			console.log("Login failed");
			res.send(401);
		}else {
			console.log("Login was successful");
			req.session.loggedIn = true;
			req.session.accountId = account._id;
			res.send(200);
		}
	 } );
});

app.get('/logoff',function(req,res) {
	if ( req.session.loggedIn ) {
		req.session.loggedIn = false;
		req.session.accountId = undefined;
		res.send(200);
	}
});

app.get('/home',function(req,res) {
	if ( req.session.loggedIn ) {
		res.render('index.jade',{layout:false, booter:'main_site/js/boot_home'});
	}else { 
		res.redirect('/');
	}
});
app.listen(8000);