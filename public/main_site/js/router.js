//DEPRECATED

define(['views/index','views/register','views/login'], 
function(IndexView, RegisterView, LoginView) {
	var MainSiteRouter = Backbone.Router.extend({
		currentView: null,
		routes: {
			'index': 'index',
			'login': 'login',
			'register': 'register',
		},
		changeView:function(view) {
			if ( this.currentView != null ) {
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},
		index: function() {
			this.changeView(new IndexView());
		},
		
		login:function() {
			this.changeView(new LoginView());
		},
		
		register:function() {
			this.changeView(new RegisterView());
		},
	});
	
	return new MainSiteRouter();
});