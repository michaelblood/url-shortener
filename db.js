const mongoose = require('mongoose');
const shortid = require('shortid');
const uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test-db';

mongoose.connect(uri);

const schema = new mongoose.Schema({
  url: String,
  _id: {
    type: String,
    default: shortid.generate
  }
});

module.exports = mongoose.model('url', schema);