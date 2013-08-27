var express = require('express');
var app = express();
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var nconf = require('nconf');

var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var _ = require('underscore');
var models = {};

//What configuration to open:
nconf.argv()
.env()
.file({ file: 'tests/editor/config.json' });

nconf.defaults({
	mode:'development'
});


console.log("Starting quesity server in " + nconf.get('mode') + " mode ... ");
var options = {
		production:{
			db_address: 'mongodb://lior:koko123@alex.mongohq.com:10039/app15419682',
			port:process.env.PORT
		},
		development: {
			db_address:'mongodb://localhost/quesity',
			port:8000
		},
		
		test_local:{
			db_address: 'mongodb://localhost/quesity-test',
			port:5000
		}
}
var configuration = options[nconf.get('mode')];
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
	mongoose.connect(configuration.db_address);
});


//Load Development app extensions:

//if ( nconf.get('mode') == 'development' ){
//	
//}

//var auth_user = function(req,res,next) {
//	if ( req.session.loggedIn ) {
//		next();
//	}else {
//		return next(new Error("Error logging in!"));
//	}
//	
//}
var auth = require('./authentication')(app,models);
app = require('./dev_functions')(app,models,auth);

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

var link_from_params = function(req,res,next) {
	var link = {};
	var type = req.param('type');
	if ( type == 'answer'){
		link.answer_txt = req.param('answer_txt');
	}else if (type == 'location') {
		link.lat = req.param('lat');
		link.lng = req.param('lng');
		link.txt_street = req.param('txt_street');
		link.radius = req.param('radius')
	}
	_.extend(link,{type:type, links_to_page:req.param('links_to_page')});
	console.log(link);
	var isThereUndefined = _.chain(link).values().filter(function(p) { return _.isUndefined(p);}).value();
	if (isThereUndefined.length > 0){
		next(new Error("Undefined value in one of the parameters"));
	}else {
		req.session.current_link = link;
		next();
	}
}

app.del('/quest/:q_id',auth.auth_user, function(req,res,next) {
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
app.del('/quest/:q_id/page/:page_id',auth.auth_user,validate_quest_account,function(req,res,next){
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
	
app.put('/quest/:q_id/page/:page_id',auth.auth_user,validate_quest_account,function(req,res,next) {
		var quest_id = req.param('q_id');
		models.QuestPage.update_page(quest_id,req.body,function(page) {
			console.log("Page updated ..");
			res.send(page);
		},function(err){
			next(new Error("Can't update page! " + err ));
		});
});


app.post('/quest/:q_id/page/:page_id/new_link',auth.auth_user,validate_quest_account,link_from_params,function(req,res,next) {
	models.QuestPage.new_link({
		quest_id:req.param('q_id'),
		page_id:req.param('page_id'),
		link:req.session.current_link
	},{
		success:function(link) {
			req.session.current_link = null;
			res.send(link);
		},error:function(err){
			next(new Error(err))
		}})
});


app.post('/quest/:q_id/page/:page_id/new_hint',auth.auth_user,validate_quest_account,function(req,res,next) {
	console.log("Inserting new hint .. ");
	models.QuestPage.new_hint({
		quest_id:req.param('q_id'),
		page_id:req.param('page_id'),
		hint:{
			hint_title: req.param('hint_title'),
			hint_txt: req.param('hint_txt')
		}
	},{
		success:function(hint) {
			res.send(hint);
		},error:function(err){
			next(new Error(err))
		}})
});

app.put('/quest/:q_id/page/:page_id/hint/:hint_id',auth.auth_user,validate_quest_account,function(req,res,next) {
	console.log("Updating hint ... ");
	var hint = {
			_id:req.param('hint_id'),
			hint_title:req.param('hint_title'),
			hint_txt:req.param('hint_txt') 
	}
	
	models.QuestPage.update_hint({
		quest_id:req.param('q_id'),
		page_id:req.param('page_id'),
		hint:hint
	},{
		success:function(hint) {
			res.send(hint);
		},error:function(err){
			next(new Error(err))
		}})
});

app.del('/quest/:q_id/page/:page_id/hint/:hint_id',auth.auth_user,validate_quest_account,function(req,res,next) {
	console.log("Deleting hint .. ");
	var hint_id = req.param('hint_id');
	models.QuestPage.delete_hint({
		quest_id:req.param('q_id'),
		page_id:req.param('page_id'),
		hint:{_id:hint_id}
	},{
		success:function(hint) {
			res.send(200);
		},error:function(err){
			next(new Error(err));
		}});
});

app.put('/quest/:q_id/page/:page_id/link/:link_id',auth.auth_user,validate_quest_account,link_from_params,function(req,res,next) {
	var link_id = req.param('link_id');
	var link = req.session.current_link;
	_.extend(link,{_id:link_id});
	console.log("Updating link: ")
	console.log(link);
	models.QuestPage.update_link({
		quest_id:req.param('q_id'),
		page_id:req.param('page_id'),
		link:link
	},{
		success:function(link) {
			req.session.current_link = null;
			res.send(link);
		},error:function(err){
			next(new Error(err))
		}})
});

app.del('/quest/:q_id/page/:page_id/link/:link_id',auth.auth_user,validate_quest_account,function(req,res,next) {
	var link_id = req.param('link_id');
	models.QuestPage.delete_link({
		quest_id:req.param('q_id'),
		page_id:req.param('page_id'),
		link:{_id:link_id}
	},{
		success:function(link) {
			req.session.current_link = null;
			console.log("Deleting link successful.. " + link_id);
			res.send(200);
		},error:function(err){
			next(new Error(err));
		}})
});

app.post('/quest/:q_id/new_page',auth.auth_user,validate_quest_account,function(req,res,next) { 
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
		
app.get('/editor/:q_id', auth.auth_user,validate_quest_account,function(req, res){
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

app.get('/quest/:q_id',auth.auth_user,validate_quest_account,function(req,res,next){

	var quest_id = req.param('q_id');
	var quest = req.session.current_quest;
	models.QuestPage.pages_by_quest_id(quest_id,function(pages){
		quest_json = quest.toJSON();
		quest_json.pages = pages || [];
		
		req.session.current_quest = null;
		
		res.send(quest_json);
	},function(err){
		next({message:"Can't find quest!",raw:err});
		return;
	});
	
});

app.post('/new_quest',auth.auth_user,function(req,res,next) { 
	var account_id = req.session.accountId;
	var title = req.param('title','');
	models.Quest.create_new({title:title,accountId:account_id},
			function(quest){
				console.log("Created quest " + quest ); 
				res.send({_id:quest._id});
			}, 
			function(err) { 
				next({message:"Can't create new quest!",raw:err});
				return;
			})
});

app.post('/register' , function(req,res,next) { 
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
		return;
	}
	models.Account.register(data,{success:success,error:error});	
	console.log("Registration completed");
});

app.get('/account/me', 
		function(req,res,next) {
			if (req.session.loggedIn ) {
				console.log("User is logged in");
				models.Account.byId(req.session.accountId, function(account) {
					res.send(account);
				},
				function(err) {
					next({message:"Can't verify login!",raw:err});
					return;
				}
				);
			} else {
				res.send(401);
			}
			
});

app.post('/login', function(req,res,next) { 

	var username = req.param('email',null);
	var password = req.param('password',null);
	console.log("Trying to log in with : " + username + " And " + password );
	if (username == null || password == null || username.length < 1 || password.length < 1 ) {
		next({message:"Can't login!"});
		return;
	}
	models.Account.login(username,password,{
		
		success:function(account){
			console.log(account);
			req.session.loggedIn = true;
			req.session.accountId = account._id;
			//Remove the password:
			res.send(_.omit(account,"password"));
		},
		error: function(err) {
			next(new Error("Error while logging in " + err));
		}
	 } );
});

app.get('/logoff',auth.auth_user,function(req,res) {
	var account_id = req.session.accountId;
	console.log("logging off account id: " + account_id);
	req.session.loggedIn = false;
	req.session.accountId = undefined;
	res.send(200);
});

app.get('/home',auth.auth_user,function(req,res) {
	res.render('index.jade',{layout:false, booter:'main_site/js/boot_home'});
});

app.listen(configuration.port);