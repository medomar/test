module.exports = (app) => {

    const AuthenticationMiddleware = require('../middlewares/auth.validation.middleware.js');

    const ArchiveAPIController = require('../controllers/archiveAPIController.js');
    const UserAPIController = require('../controllers/userAPIController.js');
    const ContactAPIController = require('../controllers/contactAPIController.js');
   
    const AutentificateAPIController = require('../controllers/autentificateAPIController.js');

    const VersionAPIController = require('../controllers/versionAPIController.js');

    const SlackController = require('../controllers/slack.controller.js');


// restFull Api Autentificate
    app.route('/georges/autentificate')
        .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isAuthAccess,AutentificateAPIController.findAll]))
        .post(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isAuthAccess,AutentificateAPIController.create]));

    app.route('/georges/autentificate/:autentificateId')
        .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isAuthAccess,AutentificateAPIController.findById]))
        .put(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isAuthAccess,AutentificateAPIController.updateById]))
        .delete(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isAuthAccess,AutentificateAPIController.deleteById]));


//restFull Api ARCHIVE
    app.route('/georges/archive')
        .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isArchiveAccess,ArchiveAPIController.findAll]))
        .post([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isArchiveAccess,ArchiveAPIController.create]);

     app.route('/georges/archive/:archiveId')
         .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isArchiveAccess,ArchiveAPIController.findById]))
         .put(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isArchiveAccess,ArchiveAPIController.updateById]))
         .delete(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isArchiveAccess,ArchiveAPIController.deleteById]));


//restFull Api USER
    app.route('/georges/user')
        .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isUserAccess,UserAPIController.findAll]))
        .post(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isUserAccess,UserAPIController.create]));

    app.route('/georges/user/:userId')
        .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isUserAccess,UserAPIController.findById]))
        .put(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isUserAccess,UserAPIController.updateById]))
        .delete(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isUserAccess,UserAPIController.deleteById]));


//restFull Api CONTACT
    app.route('/georges/contact')
        .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isContactAccess,ContactAPIController.findAll]))
        .post(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isContactAccess,ContactAPIController.create]));

    app.route('/georges/contact/:contactId')
        .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isContactAccess,ContactAPIController.findById]))
        .put(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isContactAccess,ContactAPIController.updateById]))
        .delete(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isContactAccess,ContactAPIController.deleteById]));


//restFull Api VERSION
    app.route('/georges/version')
        .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isVersionAccess,VersionAPIController.findAll]))
        .post(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isVersionAccess,VersionAPIController.create]));

    app.route('/georges/version/:versionId')
        .get(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isVersionAccess,VersionAPIController.findById]))
        .put(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isVersionAccess,VersionAPIController.updateById]))
        .delete(([AuthenticationMiddleware.isAuthValid,AuthenticationMiddleware.isVersionAccess,VersionAPIController.deleteById]));

// Service Slack
    app.route('/georges/slack')
        .post([AuthenticationMiddleware.isSlackAuthValid,AuthenticationMiddleware.isSlackAccess,SlackController.slackCommand]);

}