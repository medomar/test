const Version = require('../models/archive.model.js');
const util = require('util');

 class VersionController {
    static create (req, res) {
        // Validate request
        if(!req.body.value || !req.body.key || !req.body.channelId) {
            return res.status(400).send({
                message: "Archive content can not be empty"
            });
        }

       Version.findOneAndUpdate({key: req.body.key, channelId: req.body.channelId}, {
            key: req.body.key || "Untitled Note",
            value: req.body.value,
            url: req.body.url,
            channelId: req.body.channelId,
        }, {new: true})
      .then(update => {
            if(!update) {
               const arch = new Version({
                    key: req.body.key,
                    value: req.body.value,
                    url: req.body.url,
                    channelId: req.body.channelId
                });

            // Save Note in the database
                arch.save().then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Archive."
                    });
                });
            } else {
                     res.send(update);
                }
            });
    };

    static findAll (req, res) {
            Version.find()
        .then(alls => {
            res.send(alls);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Version."
            });
        });
    }

    static findByKey (req, res) {
        Version.find({key: req.params.key})
        .then(keys => {
            res.send(keys);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Version."
            });
        });
    }

    static findOne (req, res) {
        Version.findById(req.params.Id)
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

    static updateByKey (req, res) {
        // Validate Request
        if(!req.body.key) {
            return res.status(400).send({
                message: "Version content can not be empty"
            });
        }

        // Find note and update it with the request body
        Version.findOneAndUpdate({key: req.body.key}, {
            key: req.body.key || "Untitled Note",
            channelId: req.body.channelId,
            url: req.body.url,
            value: req.body.value
        }, {new: true})
        .then(update => {
            if(!update) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.key
                });
            }
            res.send(update);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.key
                });                
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.key
            });
        });    
    }

    static deleteByKey (req, res) {
        Version.findOneAndRemove({key: req.params.key})
        .then(delet => {
            if(!delet) {
                return res.status(404).send({
                    message: "Archive not found with id " + req.params.Id
                });
            }
            res.send({message: "Archive deleted successfully!"});
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Archive not found with id " + req.params.Id
                });                
            }
            return res.status(500).send({
                message: "Could not delete archive with id " + req.params.Id
            });
        });
    }


    /*
     *
     *   utils
     *
     */
     
    static stringRepresentationOfVersions(versionList){
        var stringRepresentation = '';
        for(var version in versionList){
            stringRepresentation +=  VersionController.stringRepresentationOfVersion(versionList[version]) + '\n';
        }

        return stringRepresentation;
    }

    static stringRepresentationOfVersion(version, argumentList){
        var key = "\n*" +  version['key'] + '*: *'  + version['numberVersion'] + '* - ' + version['value'];
        return key;
    }

    static stringRepresentationOfVersionsPublish(versionList){
        var stringRepresentation = '';
        for(var version in versionList){
            stringRepresentation +=  VersionController.stringRepresentationOfVersionPublish(versionList[version]) + '\n';
        }

        return stringRepresentation;
    }

     static stringRepresentationOfVersionPublish(version, argumentList){
        var key = "\nL'application *" +  version['numberVersion'] + '* est disponible sur le lien de *'  + version['key'] + '* suivant: \n' + version['value'];
        return key;
    }
}

exports.create = (req,res) => {
    VersionController.create(req,res);
}

exports.findAll = (req,res) => {
    VersionController.findAll(req,res);
}
exports.findByKey = (req,res) => {
    VersionController.findByKey(req,res);
}
exports.findOne = (req,res) => {
    VersionController.findOne(req,res);
}
exports.updateByKey = (req,res) => {
    VersionController.updateByKey(req,res);
}

exports.deleteByKey = (req,res) => {
    VersionController.deleteByKey(req,res);
}

module.exports = VersionController;