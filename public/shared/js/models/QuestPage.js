define(['Backbone'],function(Backbone) {

	var QuestPage = Backbone.Model.extend({
		initialize: function(options) {
			
		},
		defaults: {
			x:220,
			y:220,
			page_name:"Untitled",
			page_type: "",
			page_number: 1,
			jointObj: undefined,
			page_content:'',
		},
		get_linkable_pages: function() {
			var pages = this.get('quest').get('pages');
			var me = this;
			return pages.chain().filter( function(page) { return (
					page != me && 
					page.get('page_type') != 'surprise' 
			) } );
		}
	});
		
	return QuestPage;
	
});

