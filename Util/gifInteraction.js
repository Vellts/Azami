const gifModel = require('../models/gifAnime');

module.exports.interactionGif = interactionGif;

async function interactionGif(cmd) {
    const count = await gifModel.countDocuments({ comando: cmd }).exec()
    let rand = Math.floor(Math.random() * count)
    let gifs = await gifModel.findOne({ comando: cmd }).skip(rand)

    return gifs
};
