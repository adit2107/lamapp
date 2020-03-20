const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparser = require('body-parser');

require('./router/main')(app);

// setting view engine
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
  host     : 'malldb.czmssa40fhu4.us-east-1.rds.amazonaws.com',
  user     : 'adit2107',
  password : 'adit2107?!',
  database : 'malls'
});

connection.connect((success, err) => {
    if(err) throw err
    console.log("Connected to DB");
});

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const server = app.listen(3030, () => {
    console.log("Server running on 3030!");
})