const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

exports.Login = function (code, callback) {
 
const params = new URLSearchParams();
params.append('grant_type', 'authorization_code');
params.append('code', code);
params.append('client_id', '7j5upal5ol8dh05qbpn2n1hbk8');
params.append('redirect_uri', 'http://localhost:3030/');


fetch('https://mallapp21.auth.us-east-1.amazoncognito.com/oauth2/token', {
    method: 'POST',
    body: params
})
.then(res => res.json())
.then(response => {

    fetch('https://mallapp21.auth.us-east-1.amazoncognito.com/oauth2/userInfo', {
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