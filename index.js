////////////////////////////////////////
//          MISSION START             //
////////////////////////////////////////

// A MESSAGE FROM THE PROGRAMMER:
// I plan on using raw nodejs (no npm or whatsoever except vuejs on the front-end) but fuck it I only have a couple of hours to create this because of my current work .
// If ever I pass this test please wait for me, for my company requires me to render atleast 90 days(or less.. depends on my handled projects to transfer) after I passed my resignation letter.
// save me...


var express     = require("express"),
    bodyParser  = require("body-parser"),
    cors        = require('cors')

//just setting up the initial setup of the server(just the necessary parts)
const app = express()

//ROUTER
// I just named it mainRoute since it's just one route and everything else will be in vue.js
var mainRoute =  require('./routes')

//USE APPS
app.use(bodyParser.json());
app.set('views', __dirname + '/client');
app.set("view engine", "html");
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + "/client"));//to use the files inside this folder
app.use(bodyParser.urlencoded({ extended: true }));

var publicDir = require('path').join(__dirname, '/src/public');
app.use(express.static(publicDir));
app.use(cors())

//USE ROUTE
app.use('/',mainRoute);

//MY QUESTION:I kinda missing the purpose of nodejs here cause in vuejs(webpack version) you could just use vuejs on making api calls... welp anyway just my thought.
//MY ANSWER(AFTER 2 hours): Oh yeah.... the csv file *face palm* sorry.

//SERVER START 
app.listen(process.env.PORT || 8081, function () {
    console.log(`server has started in ${process.env.PORT || 8081}`)
    console.log(`or just paste this on your browser (ツ)_/¯ "http://localhost:8081/"`)
})