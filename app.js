var express = require('express');
var app = express();
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var _ = require('underscore');
var models = {};
var command_line_options = process.argv.splice(2);

var options = {
		production:{
			db_address: 'mongodb://lior:koko123@alex.mongohq.com:10039/app15419682',
			port:80
		},
		development: {
			db_addres:'mongodb://localhost/quesity',
			port:8000
		}
}

models.Quest = require('./models/Quest')(mongoose);
models.Account = require('./models/Account')(mongoose,models.Quest);

var generic_error = function(err, req, res, next) {
	console.log(err);
	res.send(401);
}

models.QuestPage = require('./models/QuestPage')(mongoose,extend,_);

app.configure(function(){
	console.log("Configuring ... ");
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.limit('1mb'));
	app.use(express.cookieParser());
	app.use(express.session({secret: "Lior&Tomer", store: new MemoryStore()}));
	app.use(app.router)
	app.use(generic_error);
	mongoose.connect(options[command_line_options[0]].db_address);
});

var auth_user = function(req,res,next) {
	if ( req.session.loggedIn ) {
		next();
	}else {
		return next(new Error("Error logging in!"));
	}
	
}

var validate_quest_account = function(req,res,next) {
	var account_id = req.session.accountId;
	var quest_id = req.param('q_id');
	models.Quest.validate_quest_to_account(account_id,quest_id,function(model) {
		if ( model == null || model == undefined ){
			next({message:"Can't find Quest!"});
		}else {
			req.session.current_quest = model;
			next();
		}
	});
	
}


app.del('/quest/:q_id',auth_user, function(req,res) {
	var account_id = req.session.accountId;
	var quest_id = req.param('q_id');
	console.log("Trying to delete quest");
	models.Quest.remove_quest(quest_id,account_id,
			function(){
				console.log("Deleting succeeded");
				res.send({_id:quest_id});
			},
			function(err){
				next(new Error("Can't delete quest! " + err));
			}
	);
});
app.del('/quest/:q_id/page/:page_id',auth_user,validate_quest_account,function(req,res){
	var quest_id = req.param('q_id');
	var page_id = req.param('page_id');
	models.QuestPage.remove_page({page_id:page_id,quest_id:quest_id},
		function(){
			res.send(200);
		},
		function(err){
			next({message:"Can't remove page!", raw:err});
		});
}) ;
	
app.put('/quest/:q_id/page/:page_id',auth_user,validate_quest_account,function(req,res) {
		var quest_id = req.param('q_id');
		models.QuestPage.update_page(quest_id,req.body,function(page) {
			console.log("Page updated ..");
			res.send(page);
		},function(err){
			next({message:"Can't update page!",raw:err});
		});
});

app.post('/quest/:q_id/new_page',auth_user,validate_quest_account,function(req,res) { 
		var quest_id = req.param('q_id');
		var new_page_callback = function(new_page){
			res.send({_id: new_page._id});
		};
		models.QuestPage.new_page({
			x:req.param('x'),
			y:req.param('y'),
			page_name:req.param('page_name'),
			page_type: req.param('page_type'),
			page_number: req.param('page_number'),
			page_content:req.param('page_content'),
			quest_id: quest_id
		},new_page_callback,
		function(err){
			next({message:"Can't create new page!",raw:err});
		});
	});
		
app.get('/editor/:q_id', auth_user,validate_quest_account,function(req, res){
	console.log("Trying editor...");
	var quest_id = req.param('q_id');
	res.render("editor.jade",{layout:false, quest_id: quest_id});
});
app.all('/editor/*',function(req,res) {
	res.redirect('/');
});
app.get('/', function(req, res){
	res.render("index.jade", {layout:false,booter: 'main_site/js/boot'});
});

app.get('/quest/:q_id',auth_user,validate_quest_account,function(req,res){

	var quest_id = req.param('q_id');
	var quest = req.session.current_quest;
	models.QuestPage.pages_by_quest_id(quest_id,function(pages){
		quest_json = quest.toJSON();
		quest_json.pages = pages || [];
		
		req.session.current_quest = null;
		
		res.send(quest_json);
	},function(err){
		next({message:"Can't find quest!",raw:err});
	});
	
});

app.post('/new_quest',auth_user,function(req,res) { 
	var account_id = req.session.accountId;
	var title = req.param('title','');
	models.Quest.create_new({title:title,accountId:account_id},
			function(quest){
				console.log("Created quest " + quest ); 
				res.send({_id:quest._id});
			}, 
			function(err) { 
				next({message:"Can't create new quest!",raw:err});
			})
});

app.post('/register' , function(req,res) { 
	console.log("Trying to register ... ");
	var data = {
		first_name: req.param("firstName",null),
		last_name: req.param("lastName",null),
		email: req.param("email",null),
		password: req.param("password",null)
	};
	
	var success = function(user) {
		req.session.loggedIn = true;
		req.session.accountId = user._id;
		res.send(200);
	}
	
	var error = function (err) {
		next(new Error("Error registering user!" + err));
	}
	models.Account.register(data,{success:success,error:error});	
	console.log("Registration completed");
});

app.get('/account/me', 
		function(req,res) {
			if (req.session.loggedIn ) {
				console.log("User is logged in");
				models.Account.byId(req.session.accountId, function(account) {
					res.send(account);
				},
				function(err) {
					next({message:"Can't verify login!",raw:err});
				}
				);
			} else {
				res.send(401);
			}
			
});

app.post('/login', function(req,res,next) { 

	var username = req.param('email',null);
	var password = req.param('password',null);
	
	
	if (username == null || password == null || username.length < 1 || password.length < 1 ) {
		next({message:"Can't login!"});
	}
	models.Account.login(username,password,{
		
		success:function(account){
			console.log(account);
			req.session.loggedIn = true;
			req.session.accountId = account._id;
			res.send(200);
		},
		error: function(err) {
			next(new Error("Error while logging in " + err));
		}
	 } );
});

app.get('/logoff',auth_user,function(req,res) {
	req.session.loggedIn = false;
	req.session.accountId = undefined;
	res.send(200);
});

app.get('/home',auth_user,function(req,res) {
	res.render('index.jade',{layout:false, booter:'main_site/js/boot_home'});
});

app.listen(options[command_line_options[0]].port);