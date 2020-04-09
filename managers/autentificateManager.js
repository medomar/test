const Authentificate = require('../models/autentificate.js');
const util = require('util');
class AutentificateManager {

    static create (login, password, access) {
        var AES = require('crypto-js/AES');
        var SHA256 = require('crypto-js/sha256');
        var messageEncoded = SHA256(password);

          const arch = new Authentificate({
            login: login,
            password: messageEncoded,
            access: access,
        });
        return arch.save();
  }


    static ensureAdminExist() {
        //var AES = require('crypto-js/AES');
        var SHA256 = require('crypto-js/sha256');
        Authentificate.find().then(alls => {
            if (alls.length == 0) {
                const adminUser = new Authentificate({
                    login: "admin",
                    password: SHA256("omarisomar"),
                    access: "authentication|archive|contact|user|version|slack",
                });
                adminUser.save().then(data => { 
                    const slackBotUser = new Authentificate({
                        login: "slackBot",
                        password: SHA256("nicolasmichel"),
                        access: "slack",
                    });
                    slackBotUser.save().then(data => {}); 
                });
            }
        });
    }

    static findAll (req, res) {
       return Authentificate.find();
    }

    static findByLogin (login) {
        return Authentificate.find(login);
    }

    static findOne (req, res) {
        Authentificate.findById(req.params.Id)
        .then(one => {
            if(!one) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.Id
                });            
            }
            res.send(one);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.Id
                });                
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.Id
            });
        });
    }

    static findByCriteria(login, password){
        var criteria = {};
        if(login != undefined){
            criteria['login']= login;
        }
        if(password != undefined){
            criteria['password']= password;
        }
        return Version.find(criteria);
    }

    static updateByKey (req, res) {
        // Validate Request
        if(!req.body.login) {
            return res.status(400).send({
                message: "Archive content can not be empty"
            });
        }

        // Find note and update it with the request body
        Authentificate.findOneAndUpdate({login: req.body.login}, {
            login: req.body.login || "Untitled Note",
            password: req.body.password
        }, {new: true})
        .then(update => {
            if(!update) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.login
                });
            }
            res.send(update);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.login
                });                
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.login
            });
        });    
    }

    static deleteByKey (req, res) {
        Authentificate.findOneAndRemove({login: req.params.login})
        .then(delet => {
            if(!delet) {
                return res.status(404).send({
                    message: "Archive not found with id " + req.params.login
                });
            }
            res.send({message: "Archive deleted successfully!"});
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Archive not found with id " + req.params.login
                });                
            }
            return res.status(500).send({
                message: "Could not delete archive with id " + req.params.login
            });
        });
    }





 static updateById(noteId,login,password,access) {
        console.log(noteId + ":" +login + ":" + password + ":" + access);

         return Authentificate.findByIdAndUpdate({_id: noteId}, {
            login: login,
            password: password,
            access: access,

        }, {new: true});
    }

    static deleteById(noteId) {
        return Authentificate.findOneAndRemove({_id: noteId});
    }


    static findById(noteId){
        return Authentificate.findOne({_id: noteId});
    }
static findByKey(login){
        return Authentificate.find({login: login});
    }
    /*
     *
     *   utils
     *
     */

    static stringRepresentationOfArchives(archiveList){
        var stringRepresentation = '';
        for(var archive in archiveList){
            stringRepresentation +=  SlackControllers.stringRepresentationOfArchive(archiveList[archive]) + '\n';
        }

        return stringRepresentation;
    }

    static stringRepresentationOfArchive(archive){
        var key = '• *' + archive['key'] + '* : ' + archive['value'];
        return key;
    }
}



exports.ensureAdminExist = () => {
    AutentificateAPIController.ensureAdminExist();
}

exports.findByLogin = (req,res) => {
    AutentificateAPIController.findByLogin(req,res);
}

exports.create = (login, password) => {
    AutentificateManager.create(login, password);
}

exports.findAll = () => {
    AutentificateManager.findAll();
}

exports.findByChannel = (channelId) => {
    AutentificateManager.findByChannel(channelId);
}

exports.findByCriteria = (password, login) => {
    ArchiveManager.findByCriteria(password, login);
}

exports.updateByCriteria = (login, password) => {
    ArchiveControllers.updateByCriteria(login, password);
}

exports.deleteByCriteria = (password, login) => {
    ArchiveControllers.deleteByCriteria(password, login);
}

 exports.updateById = (req,res) => {
    AutentificateAPIController.updateById(req,res);
}
exports.deleteById = (req,res) => {
    AutentificateAPIController.deleteById(req,res);
}
exports.findById = (req,res) => {
    AutentificateAPIController.findById(req,res);
}

module.exports = AutentificateManager;