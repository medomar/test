const mongoose = require('mongoose');

const ArchiveSchema = mongoose.Schema({
 	key: String,
 	value: String,
 	type: String,
 	channelId: String,

}, {
    timestamps: true
});
ArchiveSchema.index({key: 1});
module.exports = mongoose.model('archive', ArchiveSchema);