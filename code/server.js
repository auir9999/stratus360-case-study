//initial server setup and handlebars setup
const express = require("express");
const path = require("path");
const cors = require("cors");
const exphbs = require('express-handlebars');
const data = require("./data-service.js");
const { response } = require("express");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

//establishing variables as "global" because:
//pros: the data being globalled are not sensitive data, allows for reduction in redundant code, only needs to initialize once.
//cons: global variables can be a risk factor if it is sensitive data
var latest;
var next;
var previous;
var randomNum;

//setup for 4.16 express bodyparsing
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//setup for allowing access to views, layouts, and other files
app.use(express.static('views'));

app.use(cors());

//handlebars implementation for the HTML portion based on URL & establishes helpers for it
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: "main",
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        }
    }
}));

//setting up view engine for handlebars
app.set('view engine', '.hbs');

//manages URL
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

//home page navigation -> grabs and posts the latest comic
app.get("/", (req, res) => {
    data.getLatest().then((data)=>{
        //updates the next, previous and random comic values - refer to function for detail
        updateButtonNums(data);
        if(data){
            res.render("comic",{data:data, next:next, previous:previous, randomNum:randomNum});
        }else{
            res.status(404).send("comic not found - latest");
        }
    }).catch((err) => {
        res.status(404).send("comic not found - latest");
      });
})

//about page - page solely to provide additional information of the task and links to other things
app.get("/about",(req,res)=>{
    res.render("about");
})

//comic navigation -> grabs and posts data of requested comic
app.get("/comic/:comicNum", (req, res) => {
    data.getComic(req.params.comicNum).then((data)=>{
        //updates the next, previous and random comic values - refer to function for detail
        updateButtonNums(data);
        if(data){
            res.render("comic",{data:data, next:next, previous:previous, randomNum:randomNum});
        }else{
            res.status(404).send("comic not found - comicNum");
        }
    }).catch((err) => {
        res.status(404).send("comic not found - comicNum");
      });
})

//this function was implemented to reduce redundancy between getlatest and getcomic, where it updates the button's values all in one function
updateButtonNums = function(data){
    //checks if it is the latest comic and will only increment if it is not the latest
    if(data.num==latest){
        next = data.num;
    }else{
        next = data.num+1;
    }
    //checks if it is the first comic and will only decrement if it is not the first
    if(data.num==1){
        previous = data.num;
    }else{
        previous = data.num-1;
    }
    //always just randomize a number between the first and the latest from
    randomNum = Math.floor(Math.random() * latest) + 1;
}

//launching server application
app.listen(HTTP_PORT, () => {
    //grabbing the latest comic to act as total comics available
    data.getLatest().then((data)=>{
        latest = data.num;
    })
    console.log("Ready to handle requests on port " + HTTP_PORT);
});