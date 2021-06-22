const mongoose = require("mongoose");

const animeSchema = mongoose.Schema({
   globalId: {
      type: mongoose.SchemaTypes.String,
      required: true,
      default: 'wc7a69v16m'
   },
   anime: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: null
   },
   image: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: null
   },
   statusAnime: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: false
   }
});

module.exports = mongoose.model("animelist", animeSchema);
