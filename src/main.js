$(document).ready(function(){
	var memoryJournal = (function($){
		var sortedPhotos = [];
		var photos = {};
		var timeline = {};
		var options = {
			shape: 'circle',
			distance: 100
		};
		var selectedPhotoIndex = 0;

		var setup = function(data){
			photos = data;
			sortedPhotos = photos.sort(function(a, b){
				return a.taken > b.taken;
			});
			postPhotos(sortedPhotos);
			createTimeline();

			var memories = $('#memories');
			setTimeout(function(){
				$('html, body').animate({
					scrollTop: memories.offset().top
				}, 1000);
			}, 1000);

			// window.scrollTo(0, memories.offset().top);
		};

		var createTimeline = function(){
			sortedPhotos.forEach(function(photo){
				var selectedPhoto = {id: photo._id};
				var taken = new Date(photo.taken);
				var month = taken.getMonth();
				var day = taken.getDate();
				if(!timeline[month]){
					timeline[month] = {};
					timeline[month][day] = {
						pictures: []
					};
				}
				if(!timeline[month][day]){
					timeline[month][day] = {
						pictures: []
					}
				}
				timeline[month][day].pictures.push(selectedPhoto);
			});
			createTimelineButtons();
		};

		var createTimelineButtons = function(){
			var months = {
				'0': 'Jan.',
				'1': 'Feb.',
				'2': 'Mar.',
				'3': 'Apr.',
				'4': 'May',
				'5': 'Jun.',
				'6': 'Jul.',
				'7': 'Aug.',
				'8': 'Sep.',
				'9': 'Oct.',
				'10': 'Nov.',
				'11': 'Dec.',
			};
			var i = 0;
			Object.keys(months).forEach(function(month){
				if(timeline[month]){
					var ticks = createTicks(month, i);
					$('#month-time').append('<li>' + months[month] + ticks + '</li>');
					i++;
				}
			});

			addListeners();
		};

		var createTicks = function(month, index){
			var ticks = '<ol>';
			// timeline[month].ticks = Object.keys(timeline[month]).length;
			Object.keys(timeline[month]).forEach(function(day, i){
				timeline[month][day].pictures.forEach(function(photo, j){
					ticks += '<li class="tick" data-photo-id="'+photo.id+'"></li>';
					if(index == 0 && i == 0 && j == 0){
						$('#'+ photo.id).addClass('selected');
					}
				});

			});
			// for(var x = 0; x < timeline[month].ticks; x++){
			// 	ticks += '<li class="tick"></li>';
			// }
			ticks += '</ol>';
			return ticks;
		};

		var postPhotos = function(data){

			data.forEach(function(photograph, index){
				if(index == 0){
					$('.photos').append('<div id="'+photograph._id+'" class="photograph"><img src="data:image/jpg;base64,'+photograph.picture+'" />'+ photograph.caption +'</div>');
				}
				else {
					$('.photos').append('<div id="'+photograph._id+'" class="photograph"><img src="data:image/jpg;base64,'+photograph.picture+'" />'+ photograph.caption +'</div>');
				}
			});

		};

		var addListeners = function(){
			var $dayList = $('#month-time > li > ol > li');
			$dayList.on('click', null, $dayList, changePhoto);
		};

		var changePhoto = function(event){
			var photoId = event.target.dataset.photoId;
			$('.photograph').removeClass('selected');
			$('#'+photoId).addClass('selected');

			console.log(arguments);
		};

		setTimeout(function(){
			$.ajax({
				url: 'http://localhost:3000/photographs',
				success: setup,
				crossDomain: true,
				headers: {
					"Access-Control-Allow-Origin": "*",
					'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
				}
			});
		}, 2000);


	})(jQuery);
});