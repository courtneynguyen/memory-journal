'use strict';

let mongoose = require('mongoose');

var photographScehma = new mongoose.Schema({
    picture: String,
    taken: Date,
    caption: String,
    tags: [String]
});
photographScehma.methods.findByDate = function(date, cb){
    return this.model('Photograph').find({});
};
var Photograph = mongoose.model('Photograph', photographScehma);

module.exports = Photograph;