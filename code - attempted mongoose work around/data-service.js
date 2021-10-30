//using cross fetch
const fetch = require("node-fetch");

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const{comicViewCount} =require('./schema.js');
const urlAtlas ="mongodb+srv://auir9999:stratus360@viewcounter.dinb6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports.getLatest = function () {
    return new Promise(function (resolve, reject) {
        fetch('https://xkcd.com/info.0.json')
            .then(function (res) {
                return res.json();
            })
            .then(res => {
                resolve(res);
            })
            .catch(() => {
                reject("Request failed - get latest");
            });
    });
};
module.exports.getComic = function (comicNum) {
    return new Promise(function (resolve, reject) {
        fetch('https://xkcd.com/' + comicNum + '/info.0.json')
            .then(function (res) {
                return res.json();
            })
            .then(res => {
                resolve(res);
            })
            .catch(() => {
                reject("Request failed - get comic");
            });
    });
};

module.exports = function(){
    let viewCount;
    return{
        MongoConnect:function(){
            return new Promise(function (resolve, reject){
                console.log('attempting to connect to database...');
                mongoose.connect(urlAtlas);
                var db = mongoose.connection;
                db.on('error', (error) => {
                    console.log('Connection error:', error.message);
                    reject(error);
                });
                db.once('open', () => {
                    console.log('Connection to the database was successful');
                    viewCount = db.model('comicViewCount', comicViewCount, 'comicViewCount');
                    resolve();
                });
            })
        },
        getViewCount:function(comicNum){
            return new Promise(function(resolve, reject){
                viewCount.findOne({comicNumber:comicNum})
                .exec((error, item) => {
                    if (error) {
                        return reject(error.message);
                    }
                    if (item) {
                        return resolve(item);
                    } else {
                        return reject('Not found');
                    }
                });
            })
        },
        addViewCount:function(comicNum){
            return new Promise(function (resolve, reject) {
                newComic = new comicViewCount({_id:mongoose.Types.ObjectId(),comicNumber:comicNum});
                viewCount.create(newComic, (error, item) => {
                    if (error) {
                        return reject(error.message);
                    }
                    return resolve(item);
                });
            })
        },
        updateViewCount:function(comicNum){
            return new Promise(function (resolve, reject) {
                viewCount.findOneAndUpdate({ comicNumber: comicNum }, {$inc:{'comicNumber':1} }, { new: true })
                    .exec((error, item) => {
                        if (error) {
                            return reject(error.message);
                        }
                        if (item) {
                            return resolve(item);
                        } else {
                            return reject('Not found');
                        }
                    });
            })
        },
        getTotal:function(){
            viewCount.find().count(function(err, count){
                if (err){
                    console.log(err);
                }else{
                    return count;
                }
            })
        }
    }
}