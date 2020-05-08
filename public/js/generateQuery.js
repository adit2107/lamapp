let coljson = require('../files/fieldmap.json');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
    }
  });

exports.generateQuery = (queryparams) => {


    var values = [];
    
    var query = `SELECT ?? FROM ${process.env.DB_NAME}.${process.env.DB_TABLE}`;

    var result = {
        query: query,
        values: values
    };

    var kjson = {
        col1: queryparams.col1,
        col2: queryparams["col2"]
    }
   
    // Retrieving values for column names
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
    if(queryparams.hasOwnProperty('col1') && queryparams.hasOwnProperty('col2')){
        console.log("SUBMIT QUERY");
        console.log(queryparams);
        
        for (realval in coljson){
           for(var [index, value] of kjson.col1.entries()){
                if(value == realval) {
                    kjson.col1.splice(index, 1, coljson[realval]);
                }
            }   
        }
        
        var kq = knex.select(kjson.col1).from(`${process.env.DB_NAME}.${process.env.DB_TABLE}`).toSQL().toNative();
        return kq.sql;
    }
}