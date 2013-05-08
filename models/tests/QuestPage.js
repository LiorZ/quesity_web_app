var mocha = require('mocha');
var should = require('should')
var mongoose = require('mongoose');
var models = {};
models.Quest = require('../Quest')(mongoose);
models.Account = require('../Account')(mongoose,models.Quest);
var _ = require('underscore');
var extend = require('mongoose-schema-extend');

models.QuestPage = require('../QuestPage')(mongoose,extend,_);

// We need a database connection
mongoose.connect('mongodb://localhost/quesity-test');


function PageCreator(){
		this.num = 0;
		this.pages = [];
		this.create_new = function(data,done) {
			var me = this;
	    	models.QuestPage.new_page({
	    		x:0,
	    		y:0,
	    		page_name:data.page_name,
	    		page_type: data.page_type,
	    		page_number: this.num,
	    		page_content:"",
	    		quest_id: data.quest_id
	    	},
	    	function(page){
	    		page.page_name.should.be.equal(data.page_name);
	    		me.num = me.num + 1;
	    		me.pages.push(page);
	    		if ( done )
	    			done();
	    	},
	    	function(err){
	    		if ( done )
	    			done(err);
	    	});
		}
		
		this.add_link = function(quest_id, first,second,link,done) {
			var me = this;
			var page_1 = this.pages[first];
			var page_2 = this.pages[second];
			models.QuestPage.new_link({
				quest_id:quest_id,
				page_id:page_1._id,
				link:link
			},{
				success:function(link){
					done();
				},error: function(err) {
					done(err);
				}});
		}
};
var page_creator = new PageCreator();
	
describe('Testing QuestPage module', function() {
	var quest_id;
	describe('Finding the test account and creating a quest..', function() {
		var account_id;
		it('Finding the test account ... ', function( done ) { // Async test, the lone argument is the complete callback
		     models.Account.Account.findOne({email:'test@test'},function(err,doc){
		    	 if (err) {
		    		 done(err);
		    	 }else {
		    		 doc.email.should.be.equal("test@test");
		    		 account_id = doc._id
		    		 done();
		    	 }
		     })
		});
    
    it("Creating a new test quest" , function(done) {
    	models.Quest.create_new({
    		title:"Test Quest",
    		accountId: account_id
    	},function(doc) { 
    		doc.title.should.be.equal("Test Quest");
    		quest_id = doc._id; 
    		done(); 
    	}, 
    	function(err) {done(err)});
    });
    
    it("Creating a new question page" ,function(done) {
    	page_creator.create_new({
    		page_name:'Question Page',
    		page_type:'question',
    		quest_id:quest_id
    	},done);
    });
    it("Creating a location page", function(done) {
    	page_creator.create_new({
    		page_name:'Location Page',
    		page_type:'location',
    		quest_id:quest_id
    	},done);
    });
    it("Creating a location page", function(done) {
    	page_creator.create_new({
    		page_name:'Question page 2',
    		page_type:'question',
    		quest_id:quest_id
    	},done);
    });
    it ("Verifying we have 3 pages... ",function(done) {
    	page_creator.pages.length.should.be.equal(3);
    	done();
    });
    
    it("Creating link between pages 1 and 2 .. ",function(done) {
    	page_creator.add_link(quest_id,0,1,{
			links_to_page:page_creator.pages[1]._id,
			type:'answer',
			answer_txt:'Some answer'
		},done);
    });
    
    it("Updating link between pages 1 and 2 ... ",function(done){ 
    	models.QuestPage.QuestPage.findOne({_id: page_creator.pages[0]._id},function(err,doc) {
    		if (err) {
    			done(err)
    		}else {
    			models.QuestPage.update_link({
    				quest_id:quest_id,
    				page_id:doc._id,
    				link:{
    					answer_txt:'Different answer...',
    					_id:doc.links[0]._id
    				}
    			},{success:function(link) {
    				link.answer_txt.should.be.equal('Different answer...');
    				link.type.should.be.equal('answer');
    				done();
    			},error:function(err){
    				done(err);
    			}
    			});
    		}
    	})
    });
    
    it("Deleting link between pages 1 and 2", function(done) {
    	models.QuestPage.QuestPage.findOne({_id: page_creator.pages[0]._id},function(err,doc) {
    		if (err) {
    			done(err)
    		}else {
    			models.QuestPage.delete_link({
    				quest_id:quest_id,
    				page_id:doc._id,
    				link:{
    					_id:doc.links[0]._id
    				}
    			},{success:function() {
    				models.QuestPage.QuestPage.findOne({_id: page_creator.pages[0]._id},function(err,doc) {
    					if (err) {
    						done(err)
    					}else {
    						doc.links.length.should.be.equal(0);
    						done();
    					}
    				});
    			},error:function(err){
    				done(err);
    			}
    			});
    		}
    	})
    });
    

  });
});