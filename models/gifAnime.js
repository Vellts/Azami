const { Schema, model } = require('mongoose');

const gifAnime = Schema({
	name: String,
  gif: String,
  comando: String
});

module.exports = model('animeGifs', gifAnime);
