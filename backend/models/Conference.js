const { model, Schema } = require('mongoose');

const speakerSchema = new Schema({
    speaker: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    submission: {
        name: String,
        abstract: String,
        keywords: String,
        url: String,
        reviewed: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

const sectionSchema = new Schema({
    name: String,
    title: String,
    garants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    speakers: [speakerSchema],
}, {
    timestamps: true
});

const conferenceSchema = new Schema({
    name: String,
    start: Date,
    end: Date,
    location: {
        name: String,
        address: {
            street: String,        
            city: String,
            postal: String,
            country: String
        }
    },
    ticketPrice: Number,
    sections: [sectionSchema],
    //trackovanie ucastnikov BEZ prispevku v ramci celej konfery
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = model('Conference', conferenceSchema);