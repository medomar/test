const AutentificateManager = require('../managers/autentificateManager.js');
const util = require('util');


exports.create = (req,res) => {

    var login = req.body.login;
    var password = req.body.password;
    var access = req.body.access;
    if(login == undefined || password == undefined || access == undefined) {
        return res.status(400).send({
            message: "Archive content can not be empty"
        });
    }
    AutentificateManager.findByKey(login).then(archive => {
    if(archive.length != 0) {
            res.send({
            message: "Key already exist"
        })
    } else {
            AutentificateManager.create(login, password, access).then(autentificateList => {
                res.send(autentificateList);
            }).catch(err => {
                res.status(500).send({
                message: err.message || "Some error occurred while retrieving Archive."
                });
            });
        }
    });
}

exports.findAll = (req,res) => {

    AutentificateManager.findAll().then(autentificateList => {
        res.send(autentificateList);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Archive."
        });
    });
}
exports.updateById = (req,res) => {
    var login = req.body.login;
    var password = req.body.password;
    var access = req.body.access;
    var id = req.params.autentificateId;
   
     AutentificateManager.updateById(id,login,password,access).then(autentificateList => {
        res.send(autentificateList);
    }).catch(err => {
        return res.status(500).send({
            message: "Error updating note with id 3  " + id
        });
    });
}



exports.deleteById = (req,res) => {
console.log(req.params.autentificateId);
AutentificateManager.deleteById(req.params.autentificateId).then(autentificateList => {
        res.send(autentificateList);
    }).catch(err => {
        return res.status(500).send({
            message: "Error updating note with id " + req.params.noteId
        });
    });
}

exports.findById = (req, res) => {
    AutentificateManager.findById(req.params.autentificateId).then(autentificateList => {
        res.send(autentificateList);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Archive."
        });
    });
}