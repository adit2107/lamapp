const conn  = require('../app');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')

authcontroller = require('../public/js/CognitoAuthController');

module.exports = function(app)
{
   
    app.use(bodyParser.json() );   

    app.use(session({
        saveUninitialized: true,
        resave: 'true',
        secret: 'secret'
    })); 

    app.use(flash());

    app.use(bodyParser.urlencoded({     
        extended: true
    }));

    app.use(cookieParser())

    app.get('/', authcontroller.login);

    app.use((req, res, next) => {
        req.user = req.cookies.user;
        next();
    });

    app.get('/loginerror' ,(req, res) => {
        res.redirect(`https://${process.env.cog_client_name}.auth.us-east-1.amazoncognito.com/login?client_id=${process.cog_client_id}&response_type=code&redirect_uri=${process.env.redirecturi}`)
    });

    app.get('/loginsuccess', authcontroller.validate, function(req,res){
        res.render('pages/success.ejs',{connection: req.user})
     });

     app.get('/login', (req,res) => {
         res.render('pages/login.ejs');
     });

    app.get('/list', authcontroller.validate, (req, res) => {
        conn.connection.query('SELECT * FROM malls.malls', (error, results, fields) => {
            if (error) throw error;
            res.render('pages/list.ejs', {results: JSON.stringify(results)});  
        });
    });

    app.put('/list', (req, res) => {
        console.log(req.body);
        var fullq = conn.connection.query('UPDATE malls.malls SET ' + conn.connection.escapeId(req.body.columnName) + ' = ' +conn.connection.escape(req.body.newValue) +' WHERE ' + conn.connection.escapeId(req.body.columnName) +' = ' + conn.connection.escape(req.body.oldValue) +' AND serial = ' + conn.connection.escape(req.body.cellId) + '', (error, results, fields) => {
            if (error) throw error;
            res.send("Updated cell")
        });

    });

    app.delete('/list', (req,res) => {
        var data = [req.body];
        conn.connection.query('DELETE FROM malls.malls WHERE serial IN (' + data +')', (error, results, fields) => {
            if (error) throw error;
            console.log(results);
            res.send("Deleted rows");
        });
    });

    app.post('/list', (req,res) => {
        conn.connection.query('INSERT INTO malls.malls () VALUES ()', (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        } )
    });
}