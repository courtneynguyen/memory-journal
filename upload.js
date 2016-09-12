'use strict';

var fs = require('fs');
const exec = require('child_process').exec;

module.exports = (function() {
    var getPictureData = function(cb) {
        var pictures = [];
        fs.readdir(`C:/Users/courtyen/Projects/memory-journal/pictures`, function (err, files) {
            if (err) {
                console.log(err);
            }
            if (files && files.length) {

                try{
                    files.forEach((filename, index) => {
                        var caption = '';
                        var tags = [];
                        var taken = null;
                        
                        fs.readFile(`C:/Users/courtyen/Projects/memory-journal/pictures/${filename}`, 'base64', (err, data) => {
                            exec(`exiv2.exe -K Exif.Image.ImageDescription -PEv C:/Users/courtyen/Projects/memory-journal/pictures/${filename}`, (error, title, stderr) => {
                                caption = title;
                                exec(`exiv2.exe -K Exif.Image.XPKeywords -PEt C:/Users/courtyen/Projects/memory-journal/pictures/${filename}`, (error, pTags, stderr) => {
                                    tags =  pTags.split(';');
                                    exec(`exiv2.exe -K Exif.Photo.DateTimeOriginal -PEt C:/Users/courtyen/Projects/memory-journal/pictures/${filename}`, (error, time, stderr) => {
                                        var splitTime = time.split(' ');
                                        if(splitTime.length > 1){
                                            var monthDays = splitTime[0];
                                            var hourMinutes = splitTime[1].substr(0,8);
                                            var correctMonthDayFormat = monthDays.replace(/:/g, '/');

                                            taken = new Date(correctMonthDayFormat + '-' + hourMinutes);
                                        }
                                        else {
                                            taken = new Date();
                                        }
                                       
                                        pictures.push({
                                            caption: caption,
                                            tags: tags,
                                            taken: taken,
                                            picture: data
                                        });
                                        if(index >= files.length-1){
                                            console.log('CALLING BACK ' , pictures.length)
                                            cb(null, pictures);
                                        }
                                    });
                                });
                            });
                        }); 
                    });
                }
                catch(e){
                    console.log('ERROR', e);
                    cb(e, pictures);
                }
            }
        });
    }
    return {
        getPictureData: getPictureData
    }
})();

