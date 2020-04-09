const Archive = require('../models/archive.js');
const util = require('util');

class ArchiveManager {


    static create(channelId, type, key, value){
       const arch = new Archive({
            key: key,
            value: value,
            type: type,
            channelId: channelId
        });

        return arch.save();
    }

    static findAll () {
        return Archive.find();
    }


    static findByChannel(channelId){
        return Archive.find({channelId: channelId});
    }

    static findByType(type){
        return Archive.find({type: type});
    }

    static findByCriteria(channelId, type, key){
        var criteria = {}
        if(key != undefined){
            criteria['key']= key;
        }
        criteria['type']= type;
        if(channelId != undefined){
            criteria['channelId']= channelId;
        }
        return Archive.find(criteria);
    }

    static updateByCriteria(channelId, type, key, value){
        return Archive.findOneAndUpdate({key:key, type:type, channelId:channelId}, {
            key: key,
            type: type,
            channelId: channelId,
            value: value
        }, {new: true});
    }

    static deleteByCriteria (channelId, type, key) {
        return Archive.findOneAndRemove({key:key, type:type, channelId:channelId});
    }


    /*
     *
     *   utils
     *
     */
    static stringRepresentationOfArchives(archiveList){
        var stringRepresentation = '';
        for(var archive in archiveList){
            stringRepresentation +=  ArchiveManager.stringRepresentationOfArchive(archiveList[archive]) + '\n';
        }

        return stringRepresentation;
    }

    static stringRepresentationOfArchive(archive){
        var key = '• *' + archive['key'] + '* : ' + archive['value'];
        return key;
    }
}


exports.create = (channelId, type, key, value) => {
    ArchiveManager.create(channelId, type, key, value);
}

exports.findAll = () => {
    ArchiveManager.findAll();
}

exports.findByChannel = (channelId) => {
    ArchiveManager.findByChannel(channelId);
}

exports.findByType = (type) => {
    ArchiveManager.findByType(type);
}

exports.findByCriteria = (channelId, type, key) => {
    ArchiveManager.findByCriteria(channelId, type, key);
}

exports.updateByCriteria = (channelId, type, key, value) => {
    ArchiveControllers.updateByCriteria(channelId, type, key, value);
}

exports.deleteByCriteria = (channelId, type, key) => {
    ArchiveControllers.deleteByCriteria(channelId, type, key);
}

module.exports = ArchiveManager;
