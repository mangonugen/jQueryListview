//http://code.tutsplus.com/tutorials/how-to-test-your-javascript-code-with-qunit--net-9077
var item = function(id, value) {
	this.id = id;
	this.value = value;
};

module('Module A');
test("functionality", function() {
	var $div = $('<div id="listView" style="width: 150px; height: 150px; display: none;"></div>');
	var arrData = new Array();
	for (var i = 0; i < 10; i++) {
		arrData[i] = 'item ' + (i + 1);

		var data = new item(i, 'item ' + (i + 1));
		arrData[i] = data;
	}

	//var jsonString = JSON.stringify(arrData);
	var optItems = [
		{ id: "id", width: 40, formatter: ListView.Formatters.SpanDisplay},
		{ id: "value", width: 60, cssClass: "cell-title class2", formatter: ListView.Formatters.SpanDisplay}
	];

	$div.listView({
		data: arrData,
		optionItems: optItems,
		pScrollEnable: false
	});
	
	ok($div.length, "The jQuery listView has been created");
	equal($('.jListOption', $div).length, 10, "Create 10 options");
	/*ok($("div blockquote").length, "the blockquote has been created");
	equal($("div blockquote").text(), "with a totally awesome quote", "it gets the right text");
	ok($("div blockquote").hasClass("pullquote"), "applies class correctly");*/

});