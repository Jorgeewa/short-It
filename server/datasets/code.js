var mongoose = require('mongoose');
var collectionName = 'code';

var CodeSchema = new mongoose.Schema({
    value : {type : String, required : true},
    redirectUri : {type : String},
    userId : {type : String, required: true},
    clientId: { type: String, required: true }
    
});

CodeSchema.set('collection', 'code');
module.exports = mongoose.model('Code', CodeSchema);