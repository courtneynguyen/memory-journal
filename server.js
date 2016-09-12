var express = require('express');

var Photograph = require('./server/models/photograph');

module.exports = (function(){

	var router = express.Router();

	router.get('/photographs', function(req, res){
		Photograph.find({}, function(err, data){
			res.json(data);
		});
		console.log(req);
	});
	return router;
})();