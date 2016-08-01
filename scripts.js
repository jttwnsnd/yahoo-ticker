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
			var newHTML = '';
			var stockInfo = theDataJsFoundIfAny.query.results.quote;
			console.log(stockInfo);
			newHTML = '<tr><td>' + stockInfo.Symbol + '</td>';
			newHTML += '<td>' + stockInfo.Name + '</td>';
			newHTML += '<td>' + stockInfo.Ask + '</td>';
			newHTML += '<td>' + stockInfo.Bid + '</td>';
			newHTML += '<td>' + stockInfo.Change +'</td></tr>';
			$('.yahoo-body').html(newHTML);
		});
	});

})