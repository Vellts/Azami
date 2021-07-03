const { Permissions } = require('discord.js');

module.exports = class SlashCommand {
    constructor(client, name, options = {}) {
        this.client = client;
        this.name = options.name || name;
        //this.aliases = options.aliases || [];
        this.description = options.description || "Sin descripción.";
        this.options = options.options || []
        //this.category = options.category || "Fun";
        //this.usage = `${this.name} ${options.usage || ''}` || "No se ha proporcionado un uso..";
        //this.examples = options.examples || [];
        //this.disabled = options.disabled || false;
        this.cooldown = "cooldown" in options ? options.cooldown : 5 || 5;
        this.ownerOnly = options.ownerOnly || false;
        this.guildOnly = options.guildOnly || false;
        this.nsfwOnly = options.nsfwOnly || false;
        this.voiceOnly = options.voiceOnly || false;
        this.botPermission = options.botPermission || ['SEND_MESSAGES', 'EMBED_LINKS'];
        this.userPermission = options.userPermission  || null;
    } 
}