require('dotenv').config()

const express = require('express');
const app = express();
const helmet = require('helmet');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const compression = require('compression');
var spdy = require('spdy'), fs = require('fs');
var port = process.env.PORT || 3030;
const path = require('path');

app.use(helmet());

authenticatedRoute = express.Router()

app.use(compression({level: 9}));
require('./router/main')(app);


// setting view engine
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/tabulator-tables'));
app.use(express.static(__dirname + '/node_modules/bootstrap-select'));
app.use(express.static(__dirname + '/node_modules/bootstrap'));
app.use(express.static(__dirname + '/node_modules/popper.js'));
app.use(express.static(__dirname + '/node_modules/jquery'));

app.use(bodyParser.json());     
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
  
// app.listen(port, () => {
//   console.log(`Server running on: ${port}`);
// });

spdy.createServer({
  key: fs.readFileSync(path.resolve(__dirname, "public/files/localhost.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "public/files/localhost.crt"))
}, app).listen(port, () => {
  console.log(`HTTP2 server running on: ${port}`);
})

exports.connection = connection;
