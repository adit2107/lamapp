const conn  = require('../app');
const auto  = require('../public/js/autocomplete');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

module.exports = function(app)
{
    app.use(bodyParser.json() );    
    app.use(session({
        cookie: { maxAge: 60000 },
        saveUninitialized: true,
        resave: 'true',
        secret: 'secret'
    })); 
    app.use(flash());

    app.use(bodyParser.urlencoded({     
        extended: true
    }));
     app.get('/',function(req,res){
        res.render('pages/index.ejs',{connection: "Successfully authenticated."})
     });

     app.get('/login',function(req,res){
        res.render('about.ejs');
    });

    app.get('/list', (req, res) => {
        conn.connection.query('SELECT * FROM malls.malls', (error, results, fields) => {
            if (error) throw error;
            res.render('pages/list.ejs', {results: JSON.stringify(results)});  
        });
    });


    app.get('/insert', (req, res) => {
        // retreive arrays
        conn.connection.query('SELECT * FROM malls.malls', (error, results, fields) => {
            if (error) throw error;
            let mallnames = [];
            let stores = [];
            let floor = [];
            let category = [];
            let dist = [];
            let circle = [];

            for (var i=0;i<results.length;i++){
                mallnames.push(results[i].mallname)
                stores.push(results[i].stores)
                floor.push(results[i].floor)
                category.push(results[i].category)
                dist.push(results[i].distribution)
                circle.push(results[i].circle)
            }
            
            res.render('pages/insert.ejs', {results: results, mallnames: [ ...new Set(mallnames)], stores: [ ...new Set(stores)], floor: floor, category: [ ...new Set(category)], dist: [ ...new Set(dist)], circle: [ ...new Set(circle)]})
        });         
    });

    app.post('/insert', (req, res) => {
        
        // inserting
        console.log(req.body);
        conn.connection.query('INSERT INTO malls.malls (mallname, stores, floor, category, distribution, area, circle, address) VALUES ("'+req.body.mallname+'","'+req.body.stores+'","'+req.body.floor+'","'+req.body.category+'","'+req.body.distribution+'","'+req.body.area+'","'+req.body.circle+'","'+req.body.address+'")', (error, results, fields) => {
            if (error) throw error;
            console.log("Inserted record: " +results.insertId);
            req.flash("success", "Record inserted.");
            res.render("pages/insert.ejs", {mallnames: null, stores: null, floor: null, category: null, dist: null, circle: null});
        });
        
    });
}