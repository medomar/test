const mongoose = require('mongoose');

const VersionSchema = mongoose.Schema({
 	key: String,
 	value: String,
 	url: String,
 	channelId: String,

}, {
    timestamps: true
});
VersionSchema.index({key: 1});
module.exports = mongoose.model('version', VersionSchema);