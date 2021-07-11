const { Permissions } = require('discord.js');

module.exports = class Command {
    constructor(client, name, options = {}) {
        this.client = client;
        this.name = options.name || name;
        this.aliases = options.aliases || [];
        this.description = options.description || "Sin descripción.";
        this.category = options.category || "Fun";
        this.usage = `${this.name} ${options.usage || ''}` || "No se ha proporcionado un uso.";
        this.examples = options.examples || [];
        this.disabled = options.disabled || false;
        this.cooldown = "cooldown" in options ? options.cooldown : 5 || 5;
        this.ownerOnly = options.ownerOnly || false;
        this.guildOnly = options.guildOnly || false;
        this.nsfwOnly = options.nsfwOnly || false;
        this.erelaCheck = options.erelaCheck || false;
        this.voiceOnly = options.voiceOnly || false;
        this.botPermission = options.botPermission || ['ATTACH_FILES', 'EMBED_LINKS'];
        this.userPermission = options.userPermission  || [];
    } 


    // eslint-disable-next-line no-unused-vars
    async run(message, args) {
        throw new Error(`El método de ejecución no se ha implementado en ${this.name}`);
    }

    reload() {
        return this.store.load(this.file.path);
    }
}