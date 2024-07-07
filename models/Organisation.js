const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
    orgId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Organisation', organisationSchema);
