let coljson = require('../files/fieldmap.json');

exports.generateQuery = (queryparams) => {

    

    var values = [];
    
    var query = `SELECT ?? FROM ${process.env.DB_NAME}.${process.env.DB_TABLE}`;

    var result = {
        query: query,
        values: values
    };

    
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
    }

    if(queryparams.hasOwnProperty('col1') && queryparams.hasOwnProperty('col2')){
        console.log("SUBMIT QUERY");
        console.log(queryparams);
    }

   

return result;

}