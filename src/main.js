var memoryJournal = (function($){
	var postPhotos = function(data){
		data.forEach(function(photograph){
			$('.photos').append('<img src="data:image/jpg;base64,'+photograph.picture+'" />');
		});
		
	};

	$.ajax({
		url: 'http://localhost:3000/photographs',
		success: postPhotos,
		crossDomain: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
			'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
		}
	});

})(jQuery);