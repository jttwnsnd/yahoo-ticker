$(document).ready(function(){
	//add a listener for the form
	var symbolGroup = [];
	var savedList = document.getElementsByClassName('savedSymbols')[0];
	var content;
	$('.yahoo-form').submit(function(){
		//stop the form from submitting when the user pushes submit or presses enter
		event.preventDefault();
		// stores value of what is entered
		var symbol = $('#symbol').val();
		console.log(symbolGroup);

		var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("'+ symbol +'")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';

		$.getJSON(url, function(theDataJsFoundIfAny){
			console.log(url);
			console.log(theDataJsFoundIfAny);
			var stockInfo = theDataJsFoundIfAny.query.results.quote;
			var stockCount = theDataJsFoundIfAny.query.count;
			var newHTML = '';
			if(stockCount > 1){
				for(var i = 0; i < stockInfo.length; i++){
					newHTML += buildNewTable(stockInfo[i]);
				}
			}else{
				newHTML += buildNewTable(stockInfo);
				
			}
			$('.yahoo-body').html(newHTML);
			$('.table').DataTable();
			//save button function
			$('.saveButton').click(function(){
				content = $(this).parents('tr').children('.symbol')[0].innerHTML;
				symbolGroup.push(content);
				sessionStorage.setItem(symbolGroup.length, content);
				savedList.innerHTML++;
			})
			//retrieve button function
			$('.retrieveButton').click(function(){
				if(savedList.innerHTML == 0){
					alert("You have nothing saved");
				}else{
					var symbol = '';
					for(var prop in sessionStorage){
						symbol += sessionStorage[prop] + ', ';
					}
					var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("'+ symbol +'")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';

					$.getJSON(url, function(theDataJsFoundIfAny){
						var stockInfo = theDataJsFoundIfAny.query.results.quote;
						var stockCount = theDataJsFoundIfAny.query.count;
						var newHTML = '';
						if(stockCount > 1){
							for(var i = 0; i < stockInfo.length; i++){
								newHTML += buildWatchTable(stockInfo[i]);
							}
						}else{
							newHTML += buildWatchTable(stockInfo);
							
						}
						$('.watch-body').html(newHTML);
						$('.table').DataTable();
						$('.watch-list').css({'display':'table'});
						$('.removeButton').click(function(){
							for(var prop in sessionStorage){
								if(sessionStorage[prop] === $(this).parents('tr').children('.symbol')[0].innerHTML){
									sessionStorage.removeItem(prop);
								}
							}
							$(this).parents('tr').remove();
							savedList.innerHTML--;
						})
					})
				}
			})

			//reset save list
			$('.resetSave').click(function(){
				symbolGroup = [];

				sessionStorage.clear();
				console.log(sessionStorage);
				console.log(symbolGroup);
			})
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
	growingHTML = '<tr><td><button type="button" class="btn btn-default saveButton">+</button></td><td class="symbol">' + stockInfo.Symbol + '</td>';
	growingHTML += '<td>' + stockInfo.Name + '</td>';
	growingHTML += '<td>' + stockInfo.Ask + '</td>';
	growingHTML += '<td>' + stockInfo.Bid + '</td>';
	growingHTML += '<td class="'+upDown+'">' + stockInfo.Change +'</td></tr>';
	return growingHTML;
};

function buildWatchTable(stockInfo){
	if(stockInfo.Change[0] == '+'){
		var upDown = "success"; 
	}else if(stockInfo.Change[0] == '-') {
		var upDown = "danger";
	}
	var growingHTML = '';
	//lets get rid of the row, and then use append in the build table function
	growingHTML = '<tr><td><button type="button" class="btn btn-default removeButton">-</button></td><td class="symbol">' + stockInfo.Symbol + '</td>';
	growingHTML += '<td>' + stockInfo.Name + '</td>';
	growingHTML += '<td>' + stockInfo.Ask + '</td>';
	growingHTML += '<td>' + stockInfo.Bid + '</td>';
	growingHTML += '<td class="'+upDown+'">' + stockInfo.Change +'</td></tr>';
	return growingHTML;
};