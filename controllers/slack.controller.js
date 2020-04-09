const Archive = require('../models/archive.js');
const ArchiveManager = require('../managers/archiveManager.js');

const Version = require('../models/version.js');
const VersionManager = require('../managers/versionManager.js');


const util = require('util');


class SlackControllers {


    static slackCommand (req, res) {
        var userName = req.body.user_name;
        var commandText = req.body.text;
        var chanel = req.body.chanelId;
        var argumentList = commandText.split(' ');
        var commandName = argumentList[0];
        argumentList = argumentList.slice(1,argumentList.length);

		if(!commandName || commandName == undefined || commandText == 'user' || commandText == "contact"){
	    	var reply = {};
            reply.text = SlackControllers.slackCommandUndefined(commandName);
            res.json(reply);

        } else if (commandName == 'version') {
        	SlackControllers.slackCommandVersion(req, res, argumentList);

       	} else {
        	SlackControllers.slackCommandArchive(req, res, commandName, argumentList);
    	} 
    }

    static slackCommandUndefined (commandName) {
        if (!commandName) {
        return "Voici les modules disponibles:\n"
        + '• *contact* \n'
        + '• *user* \n'
        + '• *version* \n\n'
        + 'Voici les actions disponibles:\n'
        + '• list: affiche la liste de toutes les versions.\n'
        + '• add: *[key]* *[value]* ajoute une nouvelle entrée dans la base de donnée. \n'
        + '• get: *[key]* affiche les données concernant cette entrée. \n'
        + '• remove: *[key]* supprime les données concernant cette entrée. \n'
        + "• update: *[key]* met à jour l'entrée sélectionnée. \n"
        + '• publish: *[key]* affiche sur le channel la derniere publication de cette cléf. \n' 
        + ' \nGeorges Hostler\n';
        } else if (commandName == 'user' || commandName == "contact"){
        return 'Voici les actions disponibles:\n'
        + '• '+ commandName +' list: affiche la liste de toutes les versions.\n'
        + '• '+ commandName +' add: *[key]* *[value]* ajoute une nouvelle entrée dans la base de donnée. \n'
        + '• '+ commandName +' get: *[key]* affiche les données concernant cette entrée. \n'
        + '• '+ commandName +' remove: *[key]* supprime les données concernant cette entrée. \n'
        + "• "+ commandName +" update: *[key]* met à jour l'entrée sélectionnée. \n"
        + '• '+ commandName +' publish: *[key]* affiche sur le channel la derniere publication de cette cléf. \n' 
        + ' \nGeorges Hostler\n';
        }
    }


	 static slackCommandArchive(req,res,commandName,argumentList) {

	 	var typeArchiveAvailable = ["contact","user"]; 
	 	var type = undefined;  
        var reply = {};

	 	if( typeArchiveAvailable.includes(commandName)){
	 		type = commandName;
	 		commandName = argumentList[0];
        	argumentList = argumentList.slice(1,argumentList.length);
	 	}


	 	if (commandName == 'list') {
             SlackControllers.slackCommandFindAll(req, res, type, argumentList);

        } else if (commandName == 'get') {
             SlackControllers.slackCommandFind(req, res, type, argumentList);

        } else if (commandName == 'add') {
             SlackControllers.slackCommandCreate(req, res, type, argumentList);

        } else if (commandName == 'remove') {
                 SlackControllers.slackCommandDelete(req,res,type,argumentList);

        } else if (commandName == 'update') {
                SlackControllers.slackCommandUpdate(req, res, type, argumentList)

        } else if(commandName == 'publish'){        	
			SlackControllers.slackCommandPublish(req, res, type, argumentList);

        } else {
            reply.text = "La commande n'existe pas, veuillez taper *'/georges'* pour voir les options.";
            res.json(reply);
        }
 	}

/* ARCHIVE */

    static slackCommandFindAll (req, res,type, argumentList) {
    	var reply = {};

        var channelId = req.body.channel_id;
	    ArchiveManager.findByCriteria(channelId,type,undefined).then(archiveList =>{
            if(!archiveList.length){
                if (type == undefined) {
                    reply.text = "Il n'y a aucun(e) entrée(s) de créer sur ce channel.";
                } else {
                reply.text = "Il n'y a aucun(e) *"+ type +"* de créer sur ce channel.";
                }
            } else {
                if (type == undefined) {
                    reply.text = "Voici la liste des entrée(s) disponibles dans ce channel: \n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                } else {
                reply.text = "Voici la liste des *" + type + "(s)* disponibles dans ce channel: \n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                }
            }
            res.json(reply) ;
        });
    }

    static slackCommandPublish (req, res, type, argumentList) {
    	var reply = {'response_type':'in_channel'};

        var channelId = req.body.channel_id;
        var key = argumentList[0];

	    ArchiveManager.findByCriteria(channelId,type,key).then(archiveList =>{
            if(!archiveList.length){
            	if(key == undefined){
                    if (type == undefined) {
                        reply.text = "Il n'y a aucun(e) entrée(s) de créer sur ce channel.";
                    } else {
                	reply.text = "Il n'y a aucun(e) *"+ type +"* de créer sur ce channel.";
                    }
            	} if (type == undefined) {
                    reply.text = "Voici la liste des entrée(s) disponibles dans ce channel: \n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                } else {
                reply.text = "Voici la liste des *" + type + "(s)* disponibles dans ce channel: \n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                }
            } else {	
            	if(key == undefined){
                	if (type == undefined) {
                    reply.text = "Voici la liste des entrée(s) disponibles dans ce channel: \n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                } else {
                reply.text = "Voici la liste des *" + type + "(s)* disponibles dans ce channel: \n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                }
           		} else {
		            reply.text = ArchiveManager.stringRepresentationOfArchives(archiveList);
           		}
            }
            res.json(reply) ;

        }). catch(err =>{
	        reply.text =  "Le "+ type +" *" + argumentList[0] + "* n'existe pas. Veuillez en rentrer une autre.";
	        res.json(reply);
	     });
    }

    static slackCommandFind(req, res,type, argumentList) {
    	var reply = {};
        var channelId = req.body.channel_id;
        var key = argumentList[0];
	    ArchiveManager.findByCriteria(channelId,type,key).then(archiveList =>{
            if(!archiveList.length){
                if (type == undefined) {
                    reply.text = "L'entrée *" + argumentList[0] + "* n'existe pas. Veuillez en rentrer une autre.";
                } else {
                reply.text = "Le "+ type +" *" + argumentList[0] + "* n'existe pas. Veuillez en rentrer une autre.";
                }
            } else {
                if (type == undefined) {
                    reply.text = "Voici la liste des entrée(s) disponibles dans ce channel: \n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                } else {
                reply.text = "Voici la liste des *" + type + "(s)* disponibles dans ce channel: \n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                } 
             }
            res.json(reply);

         }). catch(err =>{
            reply.text =  "Le "+ type +" *" + argumentList[0] + "* n'existe pas. Veuillez en rentrer une autre.";
            res.json(reply);
         });
    }

    static slackCommandCreate(req, res,type, argumentList) {
    	var reply = {};

        var channelId = req.body.channel_id;
        var key = argumentList[0];
        var value = argumentList.slice(1,argumentList.length).join('-');

        if(key == undefined || value == undefined) {
            reply.text = "Veuillez rentrer une *[key]* et une *[value]*.";
            res.json(reply);
        }

	    ArchiveManager.findByCriteria(channelId,type,key).then(archiveList =>{
	        if(archiveList.length){
                if (type == undefined) {
                reply.text = "L'entrée *" + argumentList[0] + "* existe déjà.";
                } else {
	            reply.text = "Le "+ type +" *" + argumentList[0] + "* existe déjà.";
            }
    			res.json(reply);

	        } else {
	        	ArchiveManager.create(channelId, type, key, value).then(archive =>{
                if (type == undefined) {
                    reply.text = "L'entrée *" + key + "* a bien été créé.\n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                } else {
                reply.text = "Le *" + type + "* a bien été créé.\n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                }	                
                res.json(reply);
	           });               
	        }

	    }). catch(err =>{
	        reply.text =  "Le "+ type +" *" + argumentList[0] + "* n'existe pas. Veuillez en rentrer une autre.";
	        res.json(reply);
	    });
    }


static slackCommandDelete(req, res,type, argumentList) {
    	var reply = {};

        var channelId = req.body.channel_id;
        var key = argumentList[0];
        if(key == undefined) {
            reply.text = "Veuillez rentrer une *[key]*  .";
            res.json(reply);
        }

	    ArchiveManager.findByCriteria(channelId,type,key).then(archiveList =>{
	        if(!archiveList.length){
                if (type == undefined) {
                     reply.text = "Le "+ type +" *" + argumentList[0] + "* n'existe pas.";
                } else {
	            reply.text = "Le "+ type +" *" + argumentList[0] + "* n'existe pas.";
            }
	            res.json(reply);
	        } else {
	        	ArchiveManager.deleteByCriteria(channelId, type, key).then(archive =>{
                if (type == undefined) {
                    reply.text = "L'entrée *" + key + "* a bien été supprimée.\n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                } else {
                reply.text = "Le *" + type + "* a bien été supprimé.\n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                }                   
                res.json(reply);
               });               
	        }

	    }). catch(err =>{
	        reply.text =  "Le "+ type +" *" + argumentList[0] + "* n'existe pas. Veuillez en rentrer une autre.";
	        res.json(reply);
	    });
    }

    static slackCommandUpdate(req, res,type, argumentList) {

       	var reply = {};

        var channelId = req.body.channel_id;
        var key = argumentList[0];
        var value = argumentList[1];
        if(key == undefined) {
            reply.text = "Veuillez rentrer une *[key]*  .";
            res.json(reply);
        }

	    ArchiveManager.findByCriteria(channelId,type,key).then(archiveList =>{
	        if(!archiveList.length){
	            reply.text = "Le "+ type +" *" + argumentList[0] + "* n'existe pas.";
	            res.json(reply);
	        } else {
	        	ArchiveManager.updateByCriteria(channelId, type, key, value).then(archive =>{
                if (type == undefined) {
                    reply.text = "L'entrée *" + key + "* a bien été mis à jour.\n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                } else {
                reply.text = "Le *" + type + "* a bien été mis à jour.\n" + ArchiveManager.stringRepresentationOfArchives(archiveList);
                }                   
                res.json(reply);
               });               
	        }

	    }). catch(err =>{
	        reply.text =  "Le "+ type +" *" + argumentList[0] + "* n'existe pas. Veuillez en rentrer une autre.";
	        res.json(reply);
	    });
    }

    static slackCommandNew(req, res, argumentList) {

        var key = argumentList[0];
        var value = argumentList.slice(1,argumentList.length).join(' ');
        var channelId = req.body.channel_id;

        const arch = new Archive({
            key: key,
            value: value,
            channelId: channelId
        });
         return arch.save();
    }

/* VERSION */

    static slackCommandVersion (req, res, argumentList) {

        var commandName = argumentList[0];
        argumentList = argumentList.slice(1,argumentList.length);

        if (commandName == undefined) {
    		var reply = {};
            reply.text = SlackControllers.slackCommandUndefinedVersion();
            res.json(reply);

        } else if (commandName == 'add'){
        	SlackControllers.slackCommandCreateVersion(req, res, argumentList);

     	} else if (commandName == 'list') {
       		 SlackControllers.slackCommandFindAllVersions(req, res);

        } else if(commandName == 'get'){
            SlackControllers.slackCommandFindNumbeOfVersion(req, res, argumentList);

        } else if (commandName == 'remove') {
                  SlackControllers.slackCommandDeleteVersion(req, res, argumentList);

        } else if (commandName == 'publish'){
               SlackControllers.slackCommandPublishVersion(req, res, argumentList);

        } else if (commandName == 'new') {
            SlackControllers.slackCommandNewVersion(req, res, argumentList);

        } else { 
    		var reply = {};
            reply.text = "La commande n'existe pas, veuillez taper *'/georges version'* pour voir les options.";
            res.json(reply);
        }
    }
	static slackCommandUndefinedVersion () {
	    return 'Voici mes capacités:\n'
	    + '• version list: affiche la liste de toutes les versions.\n'
	    + '• version add: *[key]* *[numero de version]* *[url]* ajoute une nouvelle version dans la base de donnée. \n'
	    + '• version get: *[key]* affiche les données concernant cette version. \n'
        + '• version new: *[key]* modifie le numero de version concernant cette version. \n'
	    + '• version remove: *[key]* supprime les données concernant cette version. \n'
	    + '• version publish: *[key]* affiche sur le channel la derniere publication de cette version. \n' 
	    + ' \nGeorges Hostler\n';
	}

 	 static slackCommandCreateVersion(req, res, argumentList) {
    	var reply = {};

        var channelId = req.body.channel_id;
        var key = argumentList[0];
        var value = argumentList[1];
        var url = argumentList.slice(2,argumentList.length).join(' ');

        if(key == undefined || value == undefined || url == undefined) {
            reply.text = "Veuillez rentrer une *[key]* , un *[numero de version]* et une *[url]*.";
            res.json(reply);
        }

	    VersionManager.findByCriteria(channelId,key).then(versionList =>{
	        if(versionList.length){
	            reply.text = "La version *" + key + "* existe déjà.";
    			res.json(reply);

	        } else {
	        	VersionManager.create(channelId, key, value, url).then(version =>{
	               reply.text = "La version *" + key + "* a bien été créée.\n" + VersionManager.stringRepresentationOfVersion(version);
	                res.json(reply);
	             });               
	        }

	    }). catch(err =>{
            reply.text =  err;
	        res.json(reply);
	    });
    }

    static slackCommandFindNumbeOfVersion(req, res, argumentList) {
		var reply = {};

        var channelId = req.body.channel_id;
        var key = argumentList[0];

	    VersionManager.findByCriteria(channelId,key).then(versionList =>{
            if(!versionList.length){
                reply.text = "La version *" + key + "* n'existe pas. Veuillez en rentrer une autre.";
            } else {
                reply.text = "Voici la version disponible dans ce channel: \n"  + VersionManager.stringRepresentationOfVersions(versionList);
            }
            res.json(reply);

        }). catch(err =>{
            reply.text =  err;
            res.json(reply);
        });
    }

     static slackCommandFindAllVersions (req, res) {
    	var reply = {};

     	var channelId = req.body.channel_id;
        VersionManager.findByChannel(channelId).sort({key: 1}).then(versionList =>{
            if(!versionList.length){
                reply.text = "Il n'y aucune version de créer sur ce channel.";
            } else {
                reply.text = "Voici la liste des versions disponibles dans ce channel: \n" + VersionManager.stringRepresentationOfVersions(versionList);
            }
            res.json(reply) ;
        });
    }

     static slackCommandUpdateVersion(req, res, argumentList) {

        var key = argumentList[0];
        var numberVersion = argumentList[1];
        var value = argumentList.slice(2,argumentList.length).join(' ');
        var channelId = req.body.channel_id;

       return Version.findOneAndUpdate({key: key, channelId: channelId}, {
            key: key || '',
            value: value,
            numberVersion: numberVersion,
            channelId: channelId,
        }, {new: true});
    }

    static slackCommandDeleteVersion(req, res, argumentList) {
        var key = argumentList[0];
        var channelId = req.body.channel_id;
        var reply = {};

          VersionManager.findByCriteria(channelId,key).then(versionList =>{
                    if(!versionList.length){
                        reply.text = "La version *" + argumentList[0] + "* n'existe pas ou à déjà été supprimée."
                        res.json(reply);
                    } else {
                         VersionManager.deleteByCriteria(channelId, key).then(versionList =>{
                    reply.text = "La version *" + argumentList[0] + "* à été supprimée avec succès!";
                    res.json(reply);               
                    });
                };
            }); 
	}

       static slackCommandUpdateNumberOfVersion(req, res, argumentList) {

        var key = argumentList[1];
        var numberVersion = argumentList[2];
        var channelId = req.body.channel_id;

       return Version.findOneAndUpdate({key: key, channelId: channelId}, {
            numberVersion: numberVersion,
        }, {new: true});
    }


        static slackCommandPublishVersion(req, res, argumentList) {
            var reply = {'response_type':'in_channel'};
            var channelId = req.body.channel_id;
            var key = argumentList[0];

            if (key == undefined){
                VersionManager.findByChannel(channelId).then(versionList =>{
            if(!versionList.length){
                reply.text = "Il n'y aucune version publié sur ce channel.";
            } else {
                reply.text = "Voici la liste des versions disponibles dans ce channel: \n" + VersionManager.stringRepresentationOfVersions(versionList);
            }
            res.json(reply) ;
        });
        }
            VersionManager.findByCriteria(channelId, key).then(versionList =>{
                if(!versionList.length){
                    reply.text = "La version *" + argumentList[0] + "* n'existe pas. Veuillez en rentrer une autre.";
                } else {
                    reply.text = VersionManager.stringRepresentationOfVersionsPublish(versionList);
                }
                res.json(reply);

             }). catch(err =>{
                reply.text =  err + "La version  *" + argumentList[0] + "* n'existe pas. Veuillez en rentrer une autre.";
                res.json(reply);
             });
        }

        static slackCommandNewVersion(req, res, argumentList) {
            var key = argumentList[0];
            var channelId = req.body.channel_id;
             var value = argumentList.slice(1,argumentList.length).join(' ');
            var reply = {};
              VersionManager.findByCriteria(channelId,key).then(versionList =>{
                if(!versionList.length){
                        reply.text = "La version " + argumentList[0] + " n'existe pas sur ce channel."
                        res.json(reply);
                    } else {
                     VersionManager.updateByCriteria(channelId,key,value).then(version =>{
                        reply.text = "Le numero de la version *" + argumentList[0] + "* à été modifié avec succès!.\n" + VersionManager.stringRepresentationOfVersion(version,argumentList);
                        res.json(reply);
                    });               
                } 
            });
        }
}

exports.slackCommand = (req,res) => {
    SlackControllers.slackCommand(req,res);
}