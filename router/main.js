const conn  = require('../app');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const fetch = require('node-fetch');


// Important stuff
authcontroller = require('../public/js/CognitoAuthController');
querygenerator = require('../public/js/generateQuery');
encryptdata = require('../public/js/encryptdata');


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
        res.redirect(`https://${process.env.cog_client_name}.auth.${process.env.cog_region}.amazoncognito.com/login?client_id=${process.env.cog_client_id}&response_type=code&redirect_uri=${process.env.redirecturi}`)
    });

    app.get('/loginsuccess', authcontroller.validate, function(req,res){
        res.render('pages/success.ejs',{data: {connection: req.user, logout: false}})
     });

     app.get('/logout', (req,res) => {
        res.clearCookie('user', { path: '/' });
        res.clearCookie('accesstoken', {path: '/'});
        res.render('pages/logout.ejs', {data:{logout: true}});
    });

    app.get('/list', authcontroller.validate, (req, res) => {

        conn.connection.query('SELECT * FROM malls.mallslatest', (error, results, fields) => {
            if (error) throw error;
            var cipher = encryptdata.encryptdata(results);
            res.render('pages/list.ejs', {data: {results: cipher}});  
        });

      
    });

    app.put('/list', (req, res) => {
        
        conn.connection.query('UPDATE malls.mallslatest SET ' + conn.connection.escapeId(req.body.columnName) + ' = ' +conn.connection.escape(req.body.newValue) +' WHERE ' + conn.connection.escapeId(req.body.columnName) +' = ' + conn.connection.escape(req.body.oldValue) +' AND serial = ' + conn.connection.escape(req.body.cellId) + '', (error, results, fields) => {
            if (error) throw error;
            res.send("Updated cell");
        });

    });

    app.delete('/list', (req,res) => {
        var data = [req.body];
        conn.connection.query('DELETE FROM malls.mallslatest WHERE serial IN (' + data +')', (error, results, fields) => {
            if (error) throw error;
            console.log(results);
            res.send("Deleted rows");
        });
    });

    app.post('/list', (req,res) => {

        conn.connection.query('SELECT * FROM malls.mallslatest WHERE store_common_name IN (\'Adidas\', \'Adidas Kids\')', (error, results, fields) => {
            if (error) throw error;
            var cipher = encryptdata.encryptdata(results);
            res.render('pages/list.ejs', {data: {results: cipher}});  
        });

        // conn.connection.query('INSERT INTO malls.mallslatest () VALUES ()', (error, results, fields) => {
        //     if (error) throw error;
        //     res.json(results);
        // } );
    });
}