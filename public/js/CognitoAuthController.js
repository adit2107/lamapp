var CognitoAuthLogin = require('./CognitoAuthLogin');

var CognitoAuthValidate = require('./CognitoAuthValidate');



exports.login = (req, res, next) => {
    CognitoAuthLogin.Login(req.query.code, function(err, result){
        if(err) throw err;
        res.cookie('accesstoken', result.access_token, { expires: new Date(Date.now() + 1 * 3600000), httpOnly: true });
        res.cookie('user', result.accessvalues.username, { expires: new Date(Date.now() + 1 * 3600000), httpOnly: true });
        console.log("LOG");
        res.redirect('/loginsuccess');
    });
 }

exports.validate = (req, res, next) => {
    CognitoAuthValidate.Validate(req, (err, result) => {
        if (err) throw err;
        console.log("VALIDATE");
        if(result){
            next();
        } else {
            res.redirect('/loginerror');
        }
        
    });

}
