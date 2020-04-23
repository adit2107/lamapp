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

    app.get('/login', (req,res) => {
        console.log(req.user);
        if(req.user){
        res.render('pages/success.ejs', {data: {connection: req.user, logout: false}});
        } else {
        res.render('pages/login.ejs', {data:{logout: true}});
        }
    });

    app.get('/loginerror' ,(req, res) => {
        res.redirect(`https://mallapp21.auth.us-east-1.amazoncognito.com/login?client_id=7j5upal5ol8dh05qbpn2n1hbk8&response_type=code&redirect_uri=http://localhost:3030/`)
    });

    app.get('/loginsuccess', authcontroller.validate, function(req,res){
        res.render('pages/success.ejs',{data: {connection: req.user, logout: false}})
     });

     app.get('/logout', (req,res) => {
        res.clearCookie('user', { path: '/' });
        res.clearCookie('accesstoken');
        res.render('pages/logout.ejs', {data:{logout: true}});
    });

    app.get('/list', authcontroller.validate, (req, res) => {
        conn.connection.query('SELECT * FROM malls.malls', (error, results, fields) => {
            if (error) throw error;
            res.render('pages/list.ejs', {data: {results: JSON.stringify(results)}});  
        });
    });

    app.put('/list', (req, res) => {
        console.log(req.user);
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