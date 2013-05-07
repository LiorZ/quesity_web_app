casper.start('http://localhost:5000/home', function() {
	
	casper.waitFor(function check() {
        return this.evaluate(function() {
            return $('#btn_new_quest').length > 0;
        });
    }, function then() {
    	this.test.assertExists('button#btn_new_quest','Create quest button secured');
    	this.click('#btn_new_quest');
    });
	
    casper.waitFor(function check() {
    	return this.evaluate(function() {
            return $('#dlg_create_quest').dialog( "isOpen" );
        });
    },function then() {
    	this.test.assertVisible('#dlg_create_quest',"Quest creation dialog opened successfully");
    	this.fill("form#frm_create_quest",{
    		'txt_quest_title':'test_quest_1'
    	});
    	this.click('#create_quest_ok');
    });
    casper.waitFor(function check() {
    	return this.evaluate(function() {
    		return document.URL.search('/editor')>0;
    	});
    }, function then(){
    	this.test.comment('In the editor ...');
//    	this.back();
    });
//    casper.waitUntilVisible('button[name="btn_del_quest"]',function then() {
//    	this.click('button[name="btn_del_quest"]');
//    });
//    casper.waitWhileVisible('button[name="btn_del_quest]"',function then() {
//    	this.test.assertDoesntExist('button[name="btn_del_quest]','Quest deleted successfuly');
//    });
    
});
casper.run(function() {
    this.test.done();
});
