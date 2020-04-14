const conn  = require('../app');
const auto  = require('../public/js/autocomplete');

function getresults (){

}

module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('pages/index.ejs',{connection: "Connected"})
     });

     app.get('/login',function(req,res){
        res.render('about.ejs');
    });

    app.get('/list', (req, res) => {
        conn.connection.query('SELECT * FROM malls.malls', (error, results, fields) => {
            if (error) throw error;
            res.render('pages/list.ejs', {results: results})
        });
    });
// TODO: Insert function
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
        console.log(req.body);
        // inserting
        conn.connection.query('', (error, results, fields) => {

        });
    });
}