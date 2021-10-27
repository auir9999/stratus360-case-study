//initial server setup and handlebars setup
const express = require("express");
const path = require("path");
const cors = require("cors");
const exphbs = require('express-handlebars');
const data = require("./data-service.js");
const { response } = require("express");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

//setup for 4.16 express bodyparsing
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//setup for allowing access to views, layouts, and other files
app.use(express.static('views'));

app.use(cors());

//handlebars implementation for the HTML portion based on URL
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: "main",
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

//setting up view engine for handlebars
app.set('view engine', '.hbs');

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/", (req, res) => {
    data.getLatest().then((data)=>{
        if(data){
            res.render("comic",{data:data});
        }else{
            res.status(404).send("comic not found - latest");
        }
    }).catch((err) => {
        res.status(404).send("comic not found - latest");
      });
})

app.get("/:comicNum", (req, res) => {
    data.getComic(req.params.comicNum).then((data)=>{
        if(data){
            res.render("comic",{data:data});
        }else{
            res.status(404).send("comic not found - comicNum");
        }
    }).catch((err) => {
        res.status(404).send("comic not found - comicNum");
      });
})

//launching server application
app.listen(HTTP_PORT, () => {
    console.log("Ready to handle requests on port " + HTTP_PORT);
});