'use strict';

var fs = require('fs');
var async = require('async');
const exec = require('child_process').exec;
var Photograph = require('./server/models/photograph');

var createPicture = function(filename) {
    return function (callback) {
        var caption = 'No caption set';
        var tags;
        var taken;
        var picture;
        async.series([
            callback => {
                fs.readFile(`C:/Users/courtyen/Projects/memory-journal/pictures/${filename}`, 'base64', (err, data) => {
                    picture = data;
                    callback();
                });
            },
            callback => {
                exec(`exiv2.exe -K Exif.Image.ImageDescription -PEv C:/Users/courtyen/Projects/memory-journal/pictures/${filename}`, (error, title, stderr) => {
                    caption = title;
                    if (error) {
                        console.error(error);
                    }
                    callback();
                });
            },
            callback => {
                exec(`exiv2.exe -K Exif.Image.XPKeywords -PEt C:/Users/courtyen/Projects/memory-journal/pictures/${filename}`, (error, pTags, stderr) => {
                    tags = pTags.split(';');
                    if (error) {
                        console.error(error);
                    }
                    callback();
                });
            },
            callback => {
                exec(`exiv2.exe -K Exif.Photo.DateTimeOriginal -PEt C:/Users/courtyen/Projects/memory-journal/pictures/${filename}`, (error, time, stderr) => {
                    if (error) {
                        console.error(error);
                    }
                    var splitTime = time.split(' ');
                    try {
                        if (splitTime.length > 1) {
                            var monthDays = splitTime[0];
                            var hourMinutes = splitTime[1].substr(0, 8);
                            var correctMonthDayFormat = monthDays.replace(/:/g, '/');

                            taken = new Date(correctMonthDayFormat + '-' + hourMinutes);
                        }
                    }
                    catch (e) {
                        taken = new Date();
                    }
                    callback();
                });
            },
            callback => {
                Photograph.create(
                {
                    caption: caption,
                    tags: tags,
                    taken: taken,
                    picture: picture
                }, callback);
            }
        ], err => {
            callback && callback();
        });
    }
};

module.exports = (function() {
    var getPictureData = function(cb) {
        var pictures = [];
        var files;
        async.series([
            callback => {
                fs.readdir(`C:/Users/courtyen/Projects/memory-journal/pictures`, function (err, _files) {
                    if (err) {
                        console.log(err);
                    }
                    files = _files;
                    callback();
                });
            },
            callback => {
                if (files && files.length) {
                    var taskList = [];
                    files.forEach((filename) => {
                        taskList.push(createPicture(filename));
                    });
                    async.series(taskList, callback);
                }
                else {
                    callback();
                }
            }
            ]);
    };
    return {
        getPictureData: getPictureData
    }
})();

