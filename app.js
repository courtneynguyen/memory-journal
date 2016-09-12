'use strict';

var express = require('express');
var app = express();
var upload = require('./upload');
var Photograph = require('./server/models/photograph');
var server = require('./server');

var db = require('./db');
db.connect(function(status){
    console.log(status);
    init();
});
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "access-control-allow-headers, access-control-allow-origin");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

app.use(server);


var init = function() {
    if(process.env.UPLOAD){
        upload.getPictureData(function (err, pictures) {
            if(err){
                console.log('EROR', err);
            }
            // console.log('YAY', pictures);
            pictures.forEach((picture) => {
                var photo = new Photograph(picture);
                photo.save(function(err, data){
                    if(err){
                        console.log(err);
                    }
                    if(data) {
                        // console.log('SAVED');
                    }
                    // console.log(data);
                });
            });
        });
    }
};



app.listen(3000);