var express = require('express');
var app = express();
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var nconf = require('nconf');
var passport = require('passport')  , 
util = require('util'), 
FacebookStrategy = require('passport-facebook').Strategy,
FacebookTokenStrategy = require('passport-facebook-token').Strategy,
LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(express);

var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var _ = require('underscore');
var models = {};


//CONSTS:
var FACEBOOK_APP_SECRET='a3a3f2dfc55658a2c3ae3b706e7e8ac8';
var FACEBOOK_APP_ID='211673598896341';

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
			port:process.env.PORT,
			facebook_callback:"http://quesity.herokuapp.com/login/facebook/callback"
		},
		development: {
			db_address:'mongodb://localhost/quesity',
			port:8080,
			facebook_callback:"http://quesity.herokuapp.com/login/facebook/callback"
		},
		
		test_local:{
			db_address: 'mongodb://localhost/quesity-test',
			port:5000,
			faceboook_callback:"http://localhost:5000/login/facebook/callback"
		}
}
var configuration = options[nconf.get('mode')];
models.Quest = require('./models/Quest')(mongoose);
models.Account = require('./models/Account')(mongoose,models.Quest);
models.Game = require('./models/Game')(mongoose,models.Quest);

var generic_error = function(err, req, res, next) {
	console.log(err);
	res.send(401);
}

models.QuestPage = require('./models/QuestPage')(mongoose,extend,_);

passport.serializeUser(function(user, done) {
	  done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
	  models.Account.Account.findById(id,function(err,user) {
		 done(err,user); 
	  });
	});

	var passport_user_handler = function(accessToken, refreshToken, obj, done) {
	    // asynchronous verification, for effect...
	    process.nextTick(function () {
	    	var profile = obj._json;
	    	models.Account.Account.findOrCreate({email:profile.email}, {
	    		name: { first: profile.first_name, last: profile.last_name },
	    		facebook_profile_link: profile.link,
	    		gender:profile.gender,
	    		location:_.isUndefined(profile.location)?'':profile.location.name,
	    		birthday:profile.birthday,
	    		facebook_raw_data:obj._raw
	    	},function(err, user, created) {
	    		user.last_login = new Date();
	    		user.save(function(err) {
	    			done(err,user);
	    		})
	    	})
	    });
	  }
	
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: options[nconf.get('mode')].facebook_callback,
  },passport_user_handler
  
));

passport.use(new FacebookTokenStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET
  },
  passport_user_handler
));


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
  function(email, password, done) {
	 console.log("Manual login with email " + email);
	  models.Account.login(email,password,{
		  success:function(doc) {
			  return done(null,doc);
		  },
		  error: function(err) {
			  console.log(err);
		  	return done(null,false,{message:"Incorrect login"});
		  }
	  })
  })
);


app.configure(function(){
	console.log("Configuring ... ");
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.limit('1mb'));
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "Lior&Tomer", 
		store: new MongoStore({
			url:configuration.db_address
		})
	}));
	app.use(generic_error);
    app.use(passport.initialize());
    app.use(passport.session());
	app.use(app.router);
	
	console.log("Connecting to database at address: " + configuration.db_address);
	mongoose.connect(configuration.db_address);
});


var auth = require('./authentication')(passport);
app = require('./dev_functions')(app,models,auth);

require('./game_reporting')({
	app:app,
	auth:auth,
	models: models
});

var validate_quest_account = function(req,res,next) {
	var account_id = req.user._id
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

app.del('/quest/:q_id',auth.auth_user_json, function(req,res,next) {
	var account_id = req.user._id
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

app.put('/quest/:q_id', auth.auth_user_json,validate_quest_account, function(req,res,next) {
	var quest_id = req.param('q_id');
//	var quest_json = req.body;
	var quest_json = _.omit(req.body,'_id');
	quest_json.tags = _.uniq(quest_json.tags);
	console.log("Updating quest!");
	console.log(quest_json);
	models.Quest.Quest.findOneAndUpdate({_id: quest_id},quest_json, function(err,doc) {
		if ( err ) {
			next({message: "Error updating page",raw:err })
		}else {
			res.send(doc);
		}
	});
});

app.del('/quest/:q_id/page/:page_id',auth.auth_user_json,validate_quest_account,function(req,res,next){
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
	
app.put('/quest/:q_id/page/:page_id',auth.auth_user_json,validate_quest_account,function(req,res,next) {
		var quest_id = req.param('q_id');
		models.QuestPage.update_page(quest_id,req.body,function(page) {
			console.log("Page updated ..");
			res.send(page);
		},function(err){
			next(new Error("Can't update page! " + err ));
		});
});


app.post('/quest/:q_id/page/:page_id/new_link',auth.auth_user_json,validate_quest_account,link_from_params,function(req,res,next) {
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


app.post('/quest/:q_id/page/:page_id/new_hint',auth.auth_user_json,validate_quest_account,function(req,res,next) {
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

app.put('/quest/:q_id/page/:page_id/hint/:hint_id',auth.auth_user_json,validate_quest_account,function(req,res,next) {
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

app.del('/quest/:q_id/page/:page_id/hint/:hint_id',auth.auth_user_json,validate_quest_account,function(req,res,next) {
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

app.put('/quest/:q_id/page/:page_id/link/:link_id',auth.auth_user_json,validate_quest_account,link_from_params,function(req,res,next) {
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

app.del('/quest/:q_id/page/:page_id/link/:link_id',auth.auth_user_json,validate_quest_account,function(req,res,next) {
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

app.post('/quest/:q_id/new_page',auth.auth_user_json,validate_quest_account,function(req,res,next) { 
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
		
app.get('/editor/:q_id', auth.auth_user_web,validate_quest_account,function(req, res){
	console.log("Trying editor...");
	var quest_id = req.param('q_id');
	res.render("editor.jade",{layout:false, quest_id: quest_id});
});
app.all('/editor/*',function(req,res) {
	res.redirect('/');
});
app.get('/', function(req, res){
	if ( req.isAuthenticated() ) {
		res.redirect('/home');
	}else {
		res.render("index_login.jade", {layout:false});
	}
	
});

app.get('/register', function(req,res,next) {
	res.render("register.jade",{layout:false});
});

app.get('/quest/:q_id/pages',auth.auth_user_json,function(req,res,next) {
	var quest_id = req.param('q_id');
		models.QuestPage.pages_by_quest_id(quest_id,function(pages){
			res.send(pages);
	},function(err){
		next({message:"Can't find quest!",raw:err});
		return;
	});
	
});

app.get('/quest/:q_id',auth.auth_user_json,validate_quest_account,function(req,res,next){

	var quest_id = req.param('q_id');
	var quest = req.session.current_quest;
	req.session.current_quest = null;
	res.send(quest);
});

app.post('/new_quest',auth.auth_user_json,function(req,res,next) { 
	
	var account_id = req.user._id;
	var quest_data = req.body;
	// validate quest_data!
	quest_data.accountId = quest_data.accountId || account_id;
	console.log("Creating quest");
	console.log(quest_data);
	models.Quest.create_new(quest_data,
			function(quest){
				console.log("Created quest " + quest ); 
				res.send({_id:quest._id});
			}, 
			function(err) { 
				return;
			})
});


//DEPRECATED!!

app.post('/register/action' , function(req,res,next) { 
	console.log("Trying to register ... ");
	console.log(req.body);
	var data = {
		first_name: req.param("firstName",null) || req.body.firstName,
		last_name: req.param("lastName",null) || req.body.lastName,
		email: req.param("email",null) || req.body.email,
		password: req.param("password",null) || req.body.password
	};
	_.chain(data).values().each(function(val) { 
		if ( _.isNull(val) || _.isUndefined(val)){
			next(new Error("All values must be filled!"));
			return;
		}
	}).value();
	
	
	var success = function(user) {
		req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      return res.send(user);
		});
	}
	
	var error = function (err) {
		if ( err && err.err && err.err.match("E11000") ) {
			res.send(401);
			return;
		}
		next(new Error("Error registering user!" + err));
		return;
	}
	models.Account.register(data,{success:success,error:error});	
 });

app.get('/account/me',auth.auth_user_json,function(req,res,next) {
	res.send(_.omit(req.user,['password','facebook_raw_data']));
});

app.get('/account/quests', auth.auth_user_json, function(req,res,next) {
	models.Quest.Quest.find({accountId: req.user._id}, function(err,quests) {
		if (err) {
			next(err);
		}else {
			res.send(quests);
		}
	});
});

app.get('/login/facebook', passport.authenticate('facebook', {scope: ['email','user_location', 'user_birthday']}));

app.get('/login/facebook/callback',  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
	console.log("Logged in!");
    res.redirect('/home');
  });		

app.post('/register/facebook', passport.authenticate('facebook-token', {scope: ['email','user_location', 'user_birthday']}),
		function(req,res,next) {
			if ( req.user != undefined){
				res.send(req.user);
			}else {
				next();
			}
		}
);

//For the web:
app.post('/login/local',passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/'}));

//For the app:
app.post('/app/login/local',function(req, res, next) {
	  passport.authenticate('local', function(err, user, info) {
		    if (err) { return next(err) }
		    if (!user) {
		      return next(new Error("Error logging in, user cannot be found"))
		    }
		    req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      return res.send(user);
		    });
		  })(req, res, next);
});

app.get('/logoff',auth.auth_user_web,function(req,res) {
	req.logout();
	res.send(200);
});

app.get('/home',auth.auth_user_web,function(req,res) {
	res.render('index.jade',{layout:false, booter:'main_site/js/boot_home'});
});

app.listen(configuration.port);