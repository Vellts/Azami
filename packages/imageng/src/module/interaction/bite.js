
module.exports = async function Bite() {
    /**
     * Affect
     * @param {image} image 
     */
        let gif = [
    'https://cdn.discordapp.com/attachments/812851443890520124/813182262664888320/179a16220f6cf2712073ccdc759ff3e1.gif',
    'https://cdn.discordapp.com/attachments/812851443890520124/813182262370762802/tenor_2.gif',
    'https://cdn.discordapp.com/attachments/812851443890520124/813182261980954644/tenor_3.gif',
    'https://cdn.discordapp.com/attachments/812851443890520124/813182260689502218/original_1.gif',
    'https://cdn.discordapp.com/attachments/812851443890520124/813182259795329055/Omake_Gif_Anime_-_Demi-chan_wa_Kataritai_-_Episode_1_-_Hikari_Vampire_Bites_Yuki_Snow_Woman_1.gif',
    'https://cdn.discordapp.com/attachments/812851443890520124/813182151280820224/tenor_4.gif',
    'https://cdn.discordapp.com/attachments/812851443890520124/813182150475120650/original_2.gif',
    'https://cdn.discordapp.com/attachments/812851443890520124/813182150119129158/tenor_5.gif',
    'https://cdn.discordapp.com/attachments/812851443890520124/813182149472813066/50debfff9508be43a39c3945cd078aedc6a680a2_hq.gif',
    'https://cdn.discordapp.com/attachments/812851443890520124/813182148848123904/aaa.gif'
    ]
    
    return gif[Math.floor(Math.random() * gif.length)];
};