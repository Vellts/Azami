module.exports = function Die() {
    /**
     * Affect
     * @param {image} image 
     */
        let gif = [
    'https://cdn.discordapp.com/attachments/823656237672693830/823656644458053662/59573b4e95522273a0f3a736ba185b2f92c0303f_hq.gif',
    'https://cdn.discordapp.com/attachments/823656237672693830/823656643886710844/orig.58f0be9694dd7_giraffe-noose-hanging-fail.gif',
    'https://cdn.discordapp.com/attachments/823656237672693830/823656389154701372/74eb31df5797673f961814f4cfe24e60.gif',
    'https://cdn.discordapp.com/attachments/823656237672693830/823656388835672124/original_2.gif',
    'https://cdn.discordapp.com/attachments/823656237672693830/823656388471291924/F5Ai.gif',
    'https://cdn.discordapp.com/attachments/823656237672693830/823656364546326528/original_3.gif',
    'https://cdn.discordapp.com/attachments/823656237672693830/823656364051922974/photofunky.gif',
    'https://cdn.discordapp.com/attachments/823656237672693830/823656346372931594/unnamed.gif',
    'https://cdn.discordapp.com/attachments/823656237672693830/823656344598609930/Danzos_Reverse_Four_Symbols_Sealing.gif',
    'https://cdn.discordapp.com/attachments/823656237672693830/823656343398907914/AptAliveDwarfmongoose-size_restricted.gif'
    ]
    
    return gif[Math.floor(Math.random() * gif.length)];
};