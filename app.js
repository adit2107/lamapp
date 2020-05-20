require('dotenv').config()

const express = require('express');
var fs = require('fs');
var https = require('https');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const compression = require('compression');
var port = process.env.PORT || 3030;
CognitoExpress = require("cognito-express")
authenticatedRoute = express.Router()

app.use(compression({level: 9}));
require('./router/main')(app);
function forceHttps(req, res, next){
    const xfp =
      req.headers["X-Forwarded-Proto"] || req.headers["x-forwarded-proto"];
    if (xfp === "http") {
      res.redirect(301, `https://${req.hostname}${req.url}`);
    } else {
      next();
    }
 }

app.use(forceHttps);

// setting view engine
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/tabulator-tables'));
app.use(express.static(__dirname + '/node_modules/bootstrap-select'));
app.use(express.static(__dirname + '/node_modules/bootstrap'));
app.use(express.static(__dirname + '/node_modules/popper.js'));
app.use(express.static(__dirname + '/node_modules/jquery'));

app.use(bodyParser.json() );     
app.use(bodyParser.urlencoded({     
  extended: true
}));

app.use(flash());

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    connectTimeout: 5000
  });

  connection.connect((success, err) => {
    if (err){
        console.log (err);
    }
    else {
    console.log("Connected RDS " + success);
    }
});
  
// https.createServer({
// key: fs.readFileSync('server.key'),
// cert: fs.readFileSync('server.cert')
// }, 
app.listen(port, () => {
  console.log(`Server running on: ${port}`);
});

exports.connection = connection;
