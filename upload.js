'use strict';

var fs = require('fs');
const exec = require('child_process').exec;

module.exports = (function() {
    var getPictureData = function(cb) {
        var pictures = [];
        fs.readdir(`${process.env.PROJECTPATH}/memory-journal/pictures`, function (err, files) {
            if (err) {
                console.log(err);
            }
            if (files && files.length) {
                files.forEach((filename, index) => {
                    var caption = '';
                    var tags = [];
                    var taken = null;

                    fs.readFile(`${process.env.PROJECTPATH}/memory-journal/pictures/${filename}`, 'base64', (err, data) => {
                        exec(`exiv2.exe -K Exif.Image.ImageDescription -PEv ${process.env.PROJECTPATH}/memory-journal/pictures/${filename}`, (error, title, stderr) => {
                            caption = title;
                            exec(`exiv2.exe -K Exif.Image.XPKeywords -PEt ${process.env.PROJECTPATH}/memory-journal/pictures/${filename}`, (error, pTags, stderr) => {
                                tags =  pTags.split(';');
                                exec(`exiv2.exe -K Exif.Photo.DateTimeOriginal -PEt ${process.env.PROJECTPATH}/memory-journal/pictures/${filename}`, (error, time, stderr) => {
                                    var splitTime = time.split(' ');
                                    var monthDays = splitTime[0];
                                    var hourMinutes = splitTime[1].substr(0,8);
                                    var correctMonthDayFormat = monthDays.replace(/:/g, '/');

                                    taken = new Date(correctMonthDayFormat + '-' + hourMinutes);
                                    pictures.push({
                                        caption: caption,
                                        tags: tags,
                                        taken: taken,
                                        picture: data
                                    });
                                    if(index <= files.length-1){
                                        cb(null, pictures);
                                    }
                                });
                            });
                        });
                    });
                });
            }
        });
    }
    return {
        getPictureData: getPictureData
    }
})();

