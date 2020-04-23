const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

exports.Login = function (code, callback) {
 
const params = new URLSearchParams();
params.append('grant_type', 'authorization_code');
params.append('code', code);
params.append('client_id', `${process.env.cog_client_id}`);
params.append('redirect_uri', `${process.env.redirecturi}`);


fetch(`https://${process.env.cog_client_name}.auth.${process.env.cog_region}.amazoncognito.com/oauth2/token`, {
    method: 'POST',
    body: params
})
.then(res => res.json())
.then(response => {

    fetch(`https://${process.env.cog_client_name}.auth.${process.env.cog_region}.amazoncognito.com/oauth2/userInfo`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${response.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(res => res.json())
    .then(resp => {
        response["accessvalues"] = resp;
        callback(null, response);
    });
    
});

}