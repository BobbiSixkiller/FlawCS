const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {type: String}
}, {
    timestamps: true
});

module.exports = model('User', userSchema);