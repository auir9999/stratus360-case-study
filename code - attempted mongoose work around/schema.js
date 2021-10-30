//setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var comicViewCount = new Schema({
    _id:ObjectId,
    comicNumber:Number,
    comicViewCount:{type:Number, default:0}
});

module.exports = {comicViewCount:comicViewCount};