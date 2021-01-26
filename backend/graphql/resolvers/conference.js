const Conference = require('../../models/Conference');

module.exports = {
    Query: {
        async getConferences() {
            try {
                const conference = await Conference.find();
                return conference;
            } catch (err) {
                console.log(err);
                throw new Error(err);
            }
            
        }
    }
}