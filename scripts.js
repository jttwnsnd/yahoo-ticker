$(document).ready(function(){
	//add a listener for the form
	$('.yahoo-form').submit(function(){
		//stop the form from submitting when the user pushes submit or presses enter
		event.preventDefault();
		// stores value of what is entered
		var symbol = $('#symbol').val();

		var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("'+ symbol +'")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
	console.log(url);

		$.getJSON(url, function(theDataJsFoundIfAny){
			// console.log(theDataJsFoundIfAny);
			var stockInfo = theDataJsFoundIfAny.query.results.quote;
			var stockCount = theDataJsFoundIfAny.query.count;
			var newHTML = '';
			if(stockCount > 1){
				for(var i = 0; i < stockInfo.length; i++){
					newHTML += buildNewTable(stockInfo[i]);
				}
			}else{
				for(var i = 0; i < stockInfo.length; i++){
					newHTML += buildNewTable(stockInfo);
				}
			}
			$('.yahoo-body').html(newHTML);
			$('.table').DataTable();
		});
	});

})

function buildNewTable(stockInfo){
	if(stockInfo.Change[0] == '+'){
		var upDown = "success"; 
	}else if(stockInfo.Change[0] == '-') {
		var upDown = "danger";
	}
	var growingHTML = '';
	//lets get rid of the row, and then use append in the build table function
	growingHTML = '<tr><td>' + stockInfo.Symbol + '</td>';
	growingHTML += '<td>' + stockInfo.Name + '</td>';
	growingHTML += '<td>' + stockInfo.Ask + '</td>';
	growingHTML += '<td>' + stockInfo.Bid + '</td>';
	growingHTML += '<td class="'+upDown+'">' + stockInfo.Change +'</td></tr>';
	return growingHTML;
};