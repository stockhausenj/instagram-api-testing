function gotoDetail() {
	console.log("Went to Detail");
	window.location.href = "/test";
}

/*
function getAPIRes() {
	var rest = document.getElementById('rest').value;
	console.log(rest);
}
*/

$('#exec').click(function() {
	$.ajax({
		url: "/exec",
		type: "GET",
	//	dataType: "json",
		data: {
			rest: $('#rest').val()
		},
		contentType: "application/json",
		cache: false,
		timeout: 5000,
		complete: function() {
			//called when complete
			console.log('process complete');
		},
		success: function(data) {
			console.log('process sucess');
			document.getElementById("json").innerHTML = JSON.stringify(data,null,2);
		},
		error: function() {
			console.log('process error');
		},
	});
})
