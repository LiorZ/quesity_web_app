var findOrCreate = require('mongoose-findorcreate')

//Account.js
module.exports = function(mongoose,Quest) {
	var crypto = require('crypto');
	
	var password_setter = function(raw_password) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(raw_password);
		return shaSum.digest('hex');
	}
	
	var AccountSchema = new mongoose.Schema({
		email: { type:String, unique: true},
		password: { type:String, set:password_setter } ,
		name: { 
			first: {type:String}, 
			last: { type:String } 
		},
		date_registered:{type:Date, 'default':Date.now},
		gender:{type:String},
		location:{type:String},
		facebook_raw_data: {type:String},
		facebook_profile_link:{type:String},
		last_login:{type:Date, 'default':Date.now},
		birthday:{type:Date},
		activated:{type:Boolean, 'default':true},
	});
	AccountSchema.plugin(findOrCreate);
	var Account = mongoose.model('Account',AccountSchema);
	var register = function(data,callbacks) { 
		var user = new Account({ 
			email: data.email,
			name: {
				first: data.first_name,
				last: data.last_name
			},
			password: data.password
		});
		
		user.save(function(err){
			if (err) {
				callbacks.error(err);
			}else{
				callbacks.success(user);
			}
		});
	};
	
	var login = function(email,password,callbacks) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		Account.findOne({email:email,password:shaSum.digest('hex'),activated:true},{password:0}, 
				function(err,doc) 
				{ 
					if (err || doc == null) {
						callbacks.error(err);
					}else {
						callbacks.success(doc);
					}
				});
	};
	
	
	var attach_quests = function(account,succ_callback,error_callback) {
		Quest.quests_by_account(account._id,function(quests){
			if ( quests.length > 0 ){
				account.quests = quests
			}else {
				account.quests = [];
			}
			succ_callback(account);
		},error_callback);
	}
	
	var byId = function(id,succ_callback,err_callback) {
		
		Account.findOne({_id:id},function(err,doc){
			if (err || doc == null) {
				err_callback(err);
			}else {
				var obj_account = doc.toObject();
				delete obj_account.password;
				attach_quests(obj_account,succ_callback,err_callback);
			}
		});
	};
	
	return {
		Account:Account,
		register:register,
		login:login,
		byId: byId,
		attach_quests: attach_quests,
	}
}