var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var querySchema = new Schema({
    term: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});
var query = mongoose.model('queries', querySchema);
module.exports = query;
