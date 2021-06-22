const mongoose = require('mongoose');

const myanimelist = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  anime: {
    type: String,
    required: false,
  },
  rate: {
    type: String,
    default: 0,
    required: false,
  },
  episodes: {
  	type: String,
  	default: '0',
  },
  status: {
  	type: String,
  	default: 'Select Status'
  }
});


module.exports = mongoose.model('myanimelist', myanimelist);