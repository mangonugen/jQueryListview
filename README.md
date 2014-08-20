jQueryListview
==============
This jQuery plugin is currently incomplete.

##### Example 1
```html
<div id="listView" style="width: 150px; height: 150px;"></div>
```
```javascript
var item = function(id, value) {
	this.id = id;
	this.value = value;
};
		
$(function() {
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

	$('#listView').listView({
		data: arrData,
		optionItems: optItems,
		pScrollEnable: true
	});
});
```