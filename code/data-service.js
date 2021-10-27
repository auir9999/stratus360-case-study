const fetch = require("node-fetch");

module.exports.getLatest = function () {
    return new Promise(function (resolve, reject) {
        fetch('https://xkcd.com/info.0.json')
            .then(res => {
                console.log(res);
                resolve(res.json);
            })
            .catch(() => {
                reject("Request failed - get latest");
            });
    });
};
module.exports.getComic = function (comicNum) {
    return new Promise(function (resolve, reject) {
        fetch('https://xkcd.com/' + comicNum + '/info.0.json')
            .then(res => {
                console.log(res.json);
                resolve(res.json);
            })
            .catch(() => {
                reject("Request failed - get comic");
            });
    });
};

