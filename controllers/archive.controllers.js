const Archive = require('../models/archive.model.js');
const Version = require('../models/version.model.js');
const util = require('util');

class ArchiveControllers {


    static create (req, res) {
        // Validate request
        if(!req.body.value || !req.body.key || !req.body.channelId) {
            return res.status(400).send({
                message: "Archive content can not be empty"
            });
        }

       Archive.findOneAndUpdate({key: req.body.key, channelId: req.body.channelId}, {
            key: req.body.key || "Untitled Note",
            value: req.body.value,
            channelId: req.body.channelId,
        }, {new: true})
      .then(update => {
            if(!update) {
               const arch = new Archive({
                    key: req.body.key,
                    value: req.body.value,
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
            Archive.find()
        .then(alls => {
            res.send(alls);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
    }

    static findByKey (req, res) {
        Archive.find({key: req.params.key})
        .then(keys => {
            res.send(keys);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Archive."
            });
        });
    }

    static findOne (req, res) {
        Archive.findById(req.params.Id)
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
                message: "Archive content can not be empty"
            });
        }

        // Find note and update it with the request body
        Archive.findOneAndUpdate({key: req.body.key}, {
            key: req.body.key || "Untitled Note",
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
        Archive.findOneAndRemove({key: req.params.key})
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


exports.create = (req,res) => {
    ArchiveControllers.create(req,res);
}

exports.findAll = (req,res) => {
    ArchiveControllers.findAll(req,res);
}
exports.findByKey = (req,res) => {
    ArchiveControllers.findByKey(req,res);
}
exports.findOne = (req,res) => {
    ArchiveControllers.findOne(req,res);
}
exports.updateByKey = (req,res) => {
    ArchiveControllers.updateByKey(req,res);
}

exports.deleteByKey = (req,res) => {
    ArchiveControllers.deleteByKey(req,res);
}

module.exports = ArchiveControllers;
