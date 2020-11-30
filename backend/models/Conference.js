const { model, Schema } = require('mongoose');

const attendeeSchema = new Schema({
    attendee: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    paid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const speakerSchema = new Schema({
    speaker: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

}, {
    timestamps: true
});

const sectionSchema = new Schema({
    name: String,
    speakers: [speakerSchema],
    attendees: [attendeeSchema]
}, {
    timestamps: true
});

const conferenceSchema = new Schema({
    name: String,
    date: Date,
    location: {
        name: String,
        street: String,        
        city: String,
        postal: String,
        country: String
    },
    ticketPrice: Number,
    sections: [sectionSchema]
}, {
    timestamps: true
});

module.exports = model('Conference', conferenceSchema);