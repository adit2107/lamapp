require('dotenv').config()

const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const flash = require('express-flash');
require('dotenv').config()

require('./router/main')(app);

// setting view engine
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/tabulator-tables'));


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
  

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on: ${process.env.PORT}`);
})

exports.connection = connection;