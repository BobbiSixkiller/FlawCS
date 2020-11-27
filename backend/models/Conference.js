const { model, Schema } = require('mongoose');

const conferenceSchema = new Schema({
    name: {type: String},
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = model('Conference', conferenceSchema);