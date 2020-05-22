const conn  = require('../app');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const fetch = require('node-fetch');
const morgan = require('morgan');

// Important stuff
authcontroller = require('../public/js/CognitoAuthController');
querygenerator = require('../public/js/generateQuery');
encryptdata = require('../public/js/encryptdata');

module.exports = function(app)
{
    
    app.use(morgan('dev', {
        skip: (req, res) => { return res.statusCode < 400}
    }));

    app.use(bodyParser.json() );   

    app.use(session({
        saveUninitialized: true,
        resave: 'true',
        secret: 'secret',
        cookie: { secure: false }
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
        res.redirect('/');
    });

    app.get('/loginerror' ,(req, res) => {
        res.redirect(`https://${process.env.cog_client_name}.auth.${process.env.cog_region}.amazoncognito.com/login?client_id=${process.env.cog_client_id}&response_type=code&redirect_uri=${process.env.redirecturi}`)
    });

    app.get('/loginsuccess', authcontroller.validate, function(req,res){
        res.render('pages/success.ejs',{data: {connection: req.user, logout: false}})
     });

    app.get('/userlogout', (req,res) => {
        res.redirect(`https://${process.env.cog_client_name}.auth.${process.env.cog_region}.amazoncognito.com/logout?client_id=${process.env.cog_client_id}&logout_uri=${process.env.logouturi}`);
    });

    app.get('/logout', (req,res) => {
        res.clearCookie('user', { path: '/' });
        res.clearCookie('accesstoken', {path: '/'});
        res.render('pages/logout.ejs', {data:{logout: true}});
    });


    app.get('/list', authcontroller.validate, (req, res) => {
        
        conn.connection.query(`SELECT * FROM ${process.env.DB_NAME}.${process.env.DB_TABLE}`, (error, results, fields) => {
            if (error) throw error;
            
            var cipher = encryptdata.encryptdata(results);
            res.render('pages/list.ejs', {data: {results: cipher}});  
        });
    });

    app.put('/list', (req, res) => {
        console.log(req.body);
        conn.connection.query('UPDATE ' + process.env.DB_NAME +'.'+ process.env.DB_TABLE + ' SET ' + conn.connection.escapeId(req.body.columnName) + ' = ' +conn.connection.escape(req.body.newValue) +' WHERE ' + conn.connection.escapeId(req.body.columnName) +' = ' + conn.connection.escape(req.body.oldValue) +' AND serial = ' + conn.connection.escape(req.body.cellId) + '', (error, results, fields) => {
            if (error) throw error;
            res.send("Updated cell");
        });
       
    });

    app.delete('/list', async (req,res) => {
    var data = [req.body];  
    console.log(data);      
       conn.connection.promise().query('DELETE FROM ' + process.env.DB_NAME +'.'+ process.env.DB_TABLE + ' WHERE serial IN (' + data[0].rowindices +')')
       .then(([rows, fields]) => {
        return conn.connection.promise().query(`ALTER TABLE ${process.env.DB_NAME}.${process.env.DB_TABLE} DROP serial`);
       })
       .then(([rows, fields])=> {
        return conn.connection.promise().query(`ALTER TABLE ${process.env.DB_NAME}.${process.env.DB_TABLE} ADD serial int NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST`);
       })
       .then(([rows, fields]) => {
           res.send({page: data[0].page, pagesize: data[0].pagesize});
       })
       .catch(console.log);
    });

    app.post('/search', (req, res) => {
        var resq = querygenerator.generateQuery(req.body);

        conn.connection.query(resq.query, resq.values, (error, results, fields) => {
            if (error) throw error;
            
            res.json({
                results:results,
                column: resq.values[0]
            });
        });
    });

    app.post('/list', (req,res) => {

        if (Object.keys(req.body).length === 0 ) {
            conn.connection.query(`INSERT INTO ${process.env.DB_NAME}.${process.env.DB_TABLE} () VALUES ()`, (error, results, fields) => {
                if (error) throw error;
                res.json(results);
            } );
        } else {
            
            querygenerator.generateQuery(req, res);
        }  
    });

    app.post('/tabledata', async (req, res) => {
       
        if (req.body.hasOwnProperty('page') && req.body.hasOwnProperty('size') && req.body.hasOwnProperty('selectedopts')){
            req.session.filtervalues = req.body.selectedopts;
            await querygenerator.generateQuery(req, res);

        } else if (req.body.hasOwnProperty('download') && req.body.hasOwnProperty('page') && req.body.hasOwnProperty('size')){
           await querygenerator.generateQuery(req,res);
        }
        else {
            console.log("Table request");
            console.log(req.body);
            
            var offsetval = (((parseInt(req.body.page)-1) * parseInt(req.body.size)));
            const promiseconn = conn.connection.promise();
            async function getRowCount() {
                let rowscount = await promiseconn.query(`select count(*) from ${process.env.DB_NAME}.${process.env.DB_TABLE}`);
                return rowscount;
            }
            getRowCount().then(data => { 
                var maxpages = Math.ceil(parseInt(data[0][0]['count(*)'])/(parseInt(req.body.size)));
                conn.connection.query(`select * from ${process.env.DB_NAME}.${process.env.DB_TABLE} limit ${req.body.size} offset ${offsetval}`, (error, results, fields) => {
                    if (error) throw error;
                    res.send({data: results, last_page: maxpages})
                });
            });  
        }
        
       
        
    });
}

