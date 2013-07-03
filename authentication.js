module.exports = function(app,models) {
	var auth_user = function(req,res,next) {
		if ( req.session.loggedIn ) {
			next();
		}else {
			return next(new Error("Error logging in!"));
		}
		
	}
	return {
		auth_user: auth_user
	}
}