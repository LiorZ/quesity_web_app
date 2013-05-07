casper.test.comment('Testing opening screen');

casper.start('http://localhost:5000/', function() {
    this.test.assertTitle('Quesity', 'Quesity title as expected');
    
    casper.waitFor(function check() {
        return this.evaluate(function() {
            return document.URL.search('#login') > 0;
        });
    }, function then() {
        this.test.assertExists('h1', 'login form secured');
        this.test.assertExists('input[name=email]','Input text for email secured');
        this.test.assertExists('input[name=password]','Input text for password secured');
    });
    casper.then(function(){
    	this.fill('form',{
    		email:'test@test',
    		password:'1'
    	},true);
    	this.click('input[type=submit]');
    });
    casper.waitFor(function check() {
    	return this.evaluate(function() {
            return $('h1').length > 0
        });
    },function then() {
    	this.test.assertExists('h1','login was successful')
    	this.test.assertEquals(this.getElementInfo('h1').html,'Your Quests');
    	this.test.assertExists('button#btn_new_quest','Create quest button secured');
    });
});
casper.run(function() {
    this.test.done();
});

