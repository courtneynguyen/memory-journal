'use strict';

var mongoose = require('mongoose');
var connect = function(cb){
    mongoose.connect('mongodb://localhost/memory-journal');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
       cb('CONNECTED');
    });
};
module.exports = (function(){
    return {
        'connect': connect
    }
})();