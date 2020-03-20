const conn  = require('../app');

module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('pages/index.ejs',{connection: "Connected"})
     });

     app.get('/login',function(req,res){
        res.render('about.ejs');
    });

    app.get('/listall', (req, res) => {
        conn.connection.query('SELECT * FROM malls.malls LIMIT 10', (error, results, fields) => {
            if (error) throw error;
            console.log(JSON.stringify(results));
        });
    });
}