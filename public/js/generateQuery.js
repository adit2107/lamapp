let coljson = require('../files/fieldmap.json');

exports.generateQuery = (queryparams) => {
    console.log("SEARCH");
    console.log(queryparams.colname);

    var values = [];
    
    var query = `SELECT ?? FROM ${process.env.DB_NAME}.${process.env.DB_TABLE}`;

    var result = {
        query: query,
        values: values
    };

    
    if(queryparams.hasOwnProperty('colname')){
        for (var key in coljson){
            if(queryparams.colname == key){
                values.push(coljson[key]);   
            }
        }
    }

    result = {
        query: query,
        values: values
        
    };

return result;

}