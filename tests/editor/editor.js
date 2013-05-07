casper.waitFor(function check() {
    return this.evaluate(function() {
        return $('#menu').length > 0;
    });
}, function then() {
	this.test.assertExists('button#btn_new_page','Create page button secured');
	this.test.assertExists('a[data-page-type="question"]','Create question page menu item secured');
	this.click('a[data-page-type="question"]')
});

casper.waitFor(function check() {
	return this.evaluate(function() {
		return $('rect[fill="#ffcccc"]').length == 1;
	});
}, function then() {
	this.test.assertExists('rect[fill="#ffcccc"]', "Question page created successfully" );
});

casper.then(function() {
	this.click('a[data-page-type="static"]');
})
casper.waitFor(function check() {
	return this.evaluate(function() {
		return $('rect[fill="#99ff99"]').length == 1;
	});
}, function then() {
	this.test.assertExists('rect[fill="#99ff99"]', "Static page created successfully" );
	this.mouseEvent('mouseover','rect[fill="#ffcccc"]');
});

casper.waitUntilVisible('#toolbar', function then(){
	this.test.assertVisible('button #btn_delete',"Delete button became visible")
	this.test.assertVisible('button #btn_delete',"Menu became visible upon mouse over");
});

casper.run(function() {
    this.test.renderResults(true);
});