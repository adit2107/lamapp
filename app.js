const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

require('./router/main')(app);

// setting view engine
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json() );     
app.use(bodyParser.urlencoded({     
  extended: true
}));

const connection = mysql.createConnection({
    host     : 'malldb.czmssa40fhu4.us-east-1.rds.amazonaws.com',
    user     : 'adit2107',
    password : 'adit2107?!',
    database : 'malls',
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
  

const server = app.listen(3030, () => {
    console.log("Server running on 3030!");
})

exports.connection = connection;