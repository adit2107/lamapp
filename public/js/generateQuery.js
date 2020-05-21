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

    if(queryparams.body.hasOwnProperty('page') && queryparams.body.hasOwnProperty('size') && queryparams.body.hasOwnProperty('selectedopts')){
        var offsetval = (((parseInt(queryparams.body.page)-1) * parseInt(queryparams.body.size)));
        var kjson = {
            col1: queryparams.body.selectedopts.col1,
            col2: queryparams.body.selectedopts["col2"]
        }

        for (realval in coljson){
           for(var [index, value] of kjson.col1.entries()){
                if(value == realval) {
                    kjson.col1.splice(index, 1, coljson[realval]);
                }
            }   
        }

        let results = async function getRows () {
            kjson.col1.unshift('serial');
            var model = knex(`${process.env.DB_NAME}.${process.env.DB_TABLE}`)
        .where((builder) => {
            for (var item in kjson["col2"]){
                builder.whereIn(item, kjson["col2"][item])
            }     
        }
        )
        .select(kjson.col1)
        

        var totalcount = await model.clone().count();
        var records = await model.clone().offset(offsetval).limit(parseInt(queryparams.body.size));
        return {records, totalcount}
    }
    results().then((result) => {
    
        let maxpages = Math.ceil(result.totalcount[0]['count(*)']/(parseInt(queryparams.body.size)));
        res.send({data: result.records, last_page: maxpages});
    })
    .catch((err) => {
        console.log("Error!", err);
    })
    }

    if(queryparams.body.hasOwnProperty('download')){
        var kjson = {
            col1: queryparams.session.filtervalues.col1,
            col2: queryparams.session.filtervalues["col2"]
        }

        for (realval in coljson){
           for(var [index, value] of kjson.col1.entries()){
                if(value == realval) {
                    kjson.col1.splice(index, 1, coljson[realval]);
                }
            }   
        }

        let results = async function () {
            kjson.col1.unshift('serial');
            return await knex(`${process.env.DB_NAME}.${process.env.DB_TABLE}`)
        .where((builder) => {
            for (var item in kjson["col2"]){
                builder.whereIn(item, kjson["col2"][item])
            }     
        }
        )
        .select(kjson.col1)    
    }

    results().then((result) => {
        res.send({data: result});
    })

    }
}