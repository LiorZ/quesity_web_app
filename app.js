var express = require('express');
var app = express();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var _ = require('underscore');
var models = {

		Account: require('./models/Account')(mongoose,nodemailer)
		
};

app.configure(function(){
	console.log("Configuring ... ");
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.limit('1mb'));
	app.use(express.cookieParser());
	app.use(express.session({secret: "Todo App secret key", store: new MemoryStore()}));
	
	mongoose.connect('mongodb://localhost/quesity');
});

app.get('/editor', function(req, res){
	console.log("Rendering ... ");
	res.sendfile("views/editor.html", {layout:false});
});

app.get('/', function(req, res){
	console.log("Rendering ... ");
	res.render("index.jade", {layout:false});
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
				console.log("User is logged in")
				models.Account.byId(req.session.accountId,function(err) {console.log(err); res.send(401);}, function(account) {
					res.send(account);
				});
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
		res.render('home.jade',{layout:false, quests:[{id:1,title:'lior'}]});
	}else { 
		res.send(401);
	}
});
app.listen(8000);