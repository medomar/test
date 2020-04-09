const ArchiveManager = require('../managers/archiveManager.js');
const TypeKey = 'contact';


exports.create = (req,res) => {

    if(!req.body.value || !req.body.key || !req.body.channelId) {
        return res.status(400).send({
            message: "Archive content can not be empty"
        });
    }

    var key = req.body.key;
    var value = req.body.value;
    var channelId = req.body.channelId;

    ArchiveManager.create(channelId, TypeKey, key, value).then(archive => {
        res.send(archive);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Archive."
        });
    });
}

exports.findAll = (req,res) => {

    ArchiveManager.findByType(TypeKey).then(archiveList => {
        res.send(archiveList);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Archive."
        });
    });
}

exports.findAll = (req,res) => {

    ArchiveManager.findByType(TypeKey).then(archiveList => {
        res.send(archiveList);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Archive."
        });
    });
}

exports.updateById = (req,res) => {
    var key = req.body.key;
    var value = req.body.value;
    var channelId = req.body.channelId;
    ArchiveManager.updateById(req.params.contactId,key,value,channelId).then(archiveList => {
        res.send(archiveList);
    }).catch(err => {
        return res.status(500).send({
            message: "Error updating note with id " + req.params.contactId
        });
    });
}

exports.deleteById = (req,res) => {

ArchiveManager.deleteById(req.params.contactId).then(archiveList => {
        res.send(archiveList);
    }).catch(err => {
        return res.status(500).send({
            message: "Error updating note with id " + req.params.contactId
        });
    });
}

exports.findById = (req, res) => {
    ArchiveManager.findById(req.params.contactId).then(archiveList => {
        res.send(archiveList);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Archive."
        });
    });
}