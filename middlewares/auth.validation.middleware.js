const AutentificateAPIController = require('../managers/autentificateManager.js');

exports.isAuthValid = (req, res, next) => {

    var login = req.headers.login;
    var password = req.headers.password;
    var SHA256 = require('crypto-js/sha256');

    if (login != undefined && password != undefined) {
        AutentificateAPIController.findByLogin({login: login}).then(users=>{
            if(users.length){
                var user = users[0];
                var userPassword = user['password'];

                if(userPassword == SHA256(password)){
                    res.locals.user = user;
                    return next();
                } else {
                    return res.status(403).send({text:'password incorrect'});
                }
            } else {
                return res.status(403).send({text:'User not exist'});
            }
        });
    } else {
        return res.status(401).send();
    }
}

exports.isSlackAuthValid = (req, res, next) => {

    var login = req.query.login;
    var password = req.query.password;
    var SHA256 = require('crypto-js/sha256');

    if (login != undefined && password != undefined) {
        AutentificateAPIController.findByLogin({login: login}).then(users=>{
            if(users.length){
                var user = users[0];
                var userPassword = user['password'];
                if(userPassword == SHA256(password)){
                    res.locals.user = user;
                    return next();
                } else {
                    return res.status(403).send({text:'password incorrect'});
                }
            } else {
                return res.status(403).send({text:'User not exist'});
            }
        });
    } else {
        return res.status(401).send();
    }
}

exports.isAuthAccess = (req, res, next) => {
    var user = res.locals.user;
    var permitionText = user['access'];
    var permitionList = permitionText.split('|');

    if(permitionList.includes('authentication') ){
        return next();
    } else {
        return res.status(403).send({text:'Permission denied'});
    }
}

exports.isArchiveAccess = (req, res, next) => {

     var user = res.locals.user;
    var permitionText = user['access'];
    var permitionList = permitionText.split('|');

    if(permitionList.includes('archive') ){
        return next();
    } else {
        return res.status(403).send({text:'Permission denied'});
    }
}; 


exports.isUserAccess = (req, res, next) => {

    var user = res.locals.user;
    var permitionText = user['access'];
    var permitionList = permitionText.split('|');

    if(permitionList.includes('user') ){
        return next();
    } else {
        return res.status(403).send({text:'Permission denied'});
    }
}; 

exports.isContactAccess = (req, res, next) => {

     var user = res.locals.user;
    var permitionText = user['access'];
    var permitionList = permitionText.split('|');

    if(permitionList.includes('contact') ){
        return next();
    } else {
        return res.status(403).send({text:'Permission denied'});
    }
}; 

exports.isVersionAccess = (req, res, next) => {

    var user = res.locals.user;
    var permitionText = user['access'];
    var permitionList = permitionText.split('|');

    if(permitionList.includes('version') ){
        return next();
    } else {
        return res.status(403).send({text:'Permission denied'});
    }
};


exports.isSlackAccess = (req, res, next) => {

     var user = res.locals.user;
    var permitionText = user['access'];
    var permitionList = permitionText.split('|');

    if(permitionList.includes('slack') ){
        return next();
    } else {
        return res.status(403).send({text:'Permission denied'});
    }
};  