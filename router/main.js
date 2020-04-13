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
            console.log(JSON.stringify(results));
            res.render('pages/list.ejs', {results: results})
        });
    });
// TODO: Insert function
    app.get('/insert', (req, res) => {
        res.render('pages/insert.ejs')
        conn.connection.query('SELECT * FROM malls.malls', (error, results, fields) => {
            if (error) throw error;
        });
        

                
    });
}