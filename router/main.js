const conn  = require('../app');

module.exports = function(app)
{
     app.get('/',function(req,res){
         conn.connection.query('SELECT * FROM malls.malls LIMIT 10', (error, results, fields) => {
             if (error) throw error;
             console.log(JSON.stringify(results));
         });
          res.render('pages/index.ejs',{connection: "Please login"})
     });

     app.get('/about',function(req,res){
        res.render('about.ejs');
    });
}