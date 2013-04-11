var express = require('express');
var app = express();
var mongoose = require('mongoose');
//var config = { mail: require('./config/mail') };
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var _ = require('underscore')

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

app.listen(8000);