module.exports = function(app)
{
     app.get('/',function(req,res){
        const connection = mysql.createConnection({
            host     : 'malldb.czmssa40fhu4.us-east-1.rds.amazonaws.com',
            user     : 'adit2107',
            password : 'adit2107?!',
            database : 'malls'
          });
          
          connection.connect((success, err) => {
              if(err) throw err
              console.log("Connected RDS");
          });

        res.render('../views/pages/index.ejs',{connection: "Connected to DB!"})
     });
     app.get('/about',function(req,res){
        res.render('about.ejs');
    });
}