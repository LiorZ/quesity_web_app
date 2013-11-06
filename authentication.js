module.exports = function(passport) {
	var auth_user_web = function (req, res, next) {
		  if (req.isAuthenticated()) { console.log("Success!"); return next(); }
		  console.log("Failure!");
		  res.redirect('/');
	}
	
	var auth_user_json = function(req,res,next) {
		  if (req.isAuthenticated()) { return next(); }
		  res.send(401);
	}
	return {
		auth_user_web: auth_user_web,
		auth_user_json: auth_user_json
	}
}