const VersionManager = require('../managers/versionManager.js');

exports.create = (req,res) => {

    var key = req.body.key;
    var value = req.body.value;
    var url = req.body.url;
    var channelId = req.body.channelId;

    if(key == undefined || value == undefined || url == undefined || channelId == undefined) {
        return res.status(400).send({
            message: "Version content can not be empty"
        });
    }

    VersionManager.findByKey(key).then(archive => {
        if(archive.length != 0) {
            res.send({
                message: "Key already exist"
            })
        } else {
                VersionManager.create(channelId, key, value, url).then(version => {
                res.send(version);
            }).catch(err => {
                res.status(500).send({
                message: err.message || "Some error occurred while retrieving Version."
                });
            });
        }
    });    
}

exports.findAll = (req,res) => {

    VersionManager.findAll().then(versionList => {
        res.send(versionList);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Version."
        });
    });
}

exports.updateById = (req,res) => {
    var key = req.body.key;
    var value = req.body.value;
    var channelId = req.body.channelId;
    VersionManager.updateById(req.params.versionId,key,value,channelId).then(versionList => {
        res.send(versionList);
    }).catch(err => {
        return res.status(500).send({
            message: "Error updating note with id " + req.params.versionId
        });
    });
}

exports.deleteById = (req,res) => {

VersionManager.deleteById(req.params.versionId).then(versionList => {
        res.send(versionList);
    }).catch(err => {
        return res.status(500).send({
            message: "Error updating note with id " + req.params.versionId
        });
    });
}

exports.findById = (req, res) => {
    VersionManager.findById(req.params.versionId).then(versionList => {
        res.send(versionList);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Archive."
        });
    });
}