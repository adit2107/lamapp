encryptdata = require('./encryptdata');
const coljson = require('../files/fieldmap.json');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
    }
  });

exports.generateQuery = (queryparams, res) => {


    var values = [];
    
    var query = `SELECT ?? FROM ${process.env.DB_NAME}.${process.env.DB_TABLE}`;

    var result = {
        query: query,
        values: values
    };

    

    // Retrieving 3rd col values for 2nd column names
    if(queryparams.hasOwnProperty('colname')){
        console.log("COLUMN QUERY");
        console.log(queryparams);
        for (var key in coljson){
            if(queryparams.colname == key){
                values.push(coljson[key]);   
            }
        }
        result = {
            query: query,
            values: values  
        };
        return result;
    }

    // Submitting columns for filtering
    if(queryparams.body.hasOwnProperty('col1') && queryparams.body.hasOwnProperty('col2')){

        var kjson = {
            col1: queryparams.body.col1,
            col2: queryparams.body["col2"]
        }

        for (realval in coljson){
           for(var [index, value] of kjson.col1.entries()){
                if(value == realval) {
                    kjson.col1.splice(index, 1, coljson[realval]);
                }
            }   
        }
        console.log("TEST ME");
        console.log(queryparams.body);
        // var kq = knex.select(kjson.col1).from(`${process.env.DB_NAME}.${process.env.DB_TABLE}`).toSQL().toNative();

        let results = async function getRows () {
            return await knex(`${process.env.DB_NAME}.${process.env.DB_TABLE}`)
        .where((builder) => {
            for (var item in kjson["col2"]){
                builder.whereIn(item, kjson["col2"][item])
                console.log(item);
                console.log(kjson["col2"][item]);
                 
            }
            
        }
        )
        .select(kjson.col1)
    }

    results().then((valss) => {
        console.log("Got");
        console.log(valss);
        var cipher = encryptdata.encryptdata(valss);
        queryparams.session.qres = cipher;
        res.redirect('/list/filter');
    });
 
    }
}