'use strict';

var db = require('./db');
db.connect(function(status){
    console.log(status);
    init();
});
var upload = require('./upload');
var Photograph = require('./server/models/photograph');

var init = function() {
    if(process.env.UPLOAD){
        upload.getPictureData(function (err, pictures) {
            console.log('YAY', pictures);
            pictures.forEach((picture) => {
                var photo = new Photograph(picture);
                photo.save(function(err, data){
                    console.log(data);
                });
            });
        });
    }
}

