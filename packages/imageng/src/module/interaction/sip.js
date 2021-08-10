const gifModel = require('../../../../../models/gifAnime');

module.exports = async function Sip(cmd) {
    const count = await gifModel.countDocuments({ comando: cmd }).exec()
    let rand = Math.floor(Math.random() * count)
    let gifs = await gifModel.findOne({ comando: cmd }).skip(rand)

    return gifs
};
