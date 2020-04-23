const fetch = require('node-fetch');

var jwkToPem = require('jwk-to-pem'),
    jwt = require('jsonwebtoken');

var proceed = false;

exports.Validate = function(req, callback){
var token = req.cookies.accesstoken;

fetch(`https://cognito-idp.${process.env.cog_region}.amazonaws.com/${process.env.cog_pool_id}/.well-known/jwks.json`, {
    method: 'GET'  
})
.then(res => res.json())
.then(response => {
                pems = {};
                   var keys = response['keys'];
                   for(var i = 0; i < keys.length; i++) {
                        var key_id = keys[i].kid;
                        var modulus = keys[i].n;
                        var exponent = keys[i].e;
                        var key_type = keys[i].kty;
                        var jwk = { kty: key_type, n: modulus, e: exponent};
                        var pem = jwkToPem(jwk);
                        pems[key_id] = pem;
                   }
                   var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    proceed = false;
                    callback(null, proceed);
                }            
               var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    proceed = false;
                    callback(null, proceed);
                }            
                jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        console.log("Invalid Token.");
                        proceed = false;
                    callback(null, proceed);
                    } else {
                        proceed = true;
                         callback(null, proceed);
                    }
               }); 
                
})
.catch(err => {
    console.log("inside error");
    console.error(err);
    callback(err, proceed);
});
}