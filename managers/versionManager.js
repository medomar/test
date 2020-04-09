const Version = require('../models/version.js');
const util = require('util');

class VersionManager {


    static create(channelId, key, value, url){
       const arch = new Version({
            key: key,
            value: value,
            url: url,
            channelId: channelId
        });

        return arch.save();
    }

    static findAll () {
        return Version.find();
    }


    static findByChannel(channelId){
        return Version.find({channelId: channelId});
    }

    static findByCriteria(channelId, key){
        var criteria = {};
        if(key != undefined){
            criteria['key']= key;
        }
        if(channelId != undefined){
            criteria['channelId']= channelId;
        }
        return Version.find(criteria);
    }

    static updateByCriteria(channelId, key, value){
        return Version.findOneAndUpdate({key:key, channelId:channelId}, {
            key: key,
            channelId: channelId,
            value: value
        }, {new: true});
    }

    static deleteByCriteria (channelId, key) {
        return Version.findOneAndRemove({key:key, channelId:channelId});
    }

    static updateById(noteId,key,value,channelId) {
         return Version.findOneAndUpdate({_id: noteId}, {
            key: key,
            value: value,
            channelId: channelId,

        }, {new: true});
    }

    static deleteById(noteId) {
        console.log(noteId);
        return Version.findOneAndRemove({_id: noteId});
    }


    static findById(noteId){
        return Version.findOne({_id: noteId});
    }

static findByKey(key){
        return Version.find({key: key});
    }
    /*
     *
     *   utils
     *
     */
    static stringRepresentationOfVersions(versionList){
        var stringRepresentation = '';
        for(var version in versionList){
            stringRepresentation +=  VersionManager.stringRepresentationOfVersion(versionList[version]) + '\n';
        }

        return stringRepresentation;
    }

    static stringRepresentationOfVersion(version){
        var key = "\n*" +  version['key'] + '*: *'  + version['value'] + '* - ' + version['url'];
        return key;
    }

     static stringRepresentationOfVersionsPublish(versionList){
        var stringRepresentation = '';
        for(var version in versionList){
            stringRepresentation +=  VersionManager.stringRepresentationOfVersionPublishs(versionList[version]) + '\n';
        }

        return stringRepresentation;
    }

     static stringRepresentationOfVersionPublishs(version, argumentList){
        var key = "\nL'application *" +  version['value'] + '* est disponible sur le lien de *'  + version['key'] + '* suivant: \n' + version['url'];
        return key;
    }
}


exports.create = (channelId, key, value, url) => {
    VersionManager.create(channelId, key, value, url);
}

exports.findAll = () => {
    VersionManager.findAll();
}

exports.findByChannel = (channelId) => {
    VersionManager.findByChannel(channelId);
}

exports.findByCriteria = (channelId, key, url) => {
    ArchiveManager.findByCriteria(channelId, key, url);
}

exports.updateByCriteria = (channelId, key, value) => {
    VersionControllers.updateByCriteria(channelId, key, value);
}

exports.deleteByCriteria = (channelId, key) => {
    VersionControllers.deleteByCriteria(channelId, key);
}

module.exports = VersionManager;