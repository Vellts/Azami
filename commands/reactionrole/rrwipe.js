const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');

const ReactionRole = require("../../packages/reactionrole/models/schema")


module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'wipe',
        aliases: ["reactionrolewipe", "reactionroleswipe", "rrwipe"],
        description: 'Wipe all reaction Roles from the current guild',
        category: 'Reaction Role',
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
    let client = message.client

       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });

      


const conditional = {
   guildid: message.guild.id
}
const results = await ReactionRole.find(conditional)

if (results && results.length) {
    for (const result of results) {
        const { guildid } = result

        try {
            await ReactionRole.deleteOne(conditional)
        } catch (e) {
            console.log(e)
        }

    }

}


let resultsHeheLol = results.length
let resultsHehe = `reaction roles`
if (resultsHeheLol == '1') resultsHehe = 'reaction role';

if (resultsHeheLol === '0' || !results || !results.length){

let wipeEmbed3 = new MessageEmbed()
.setColor(message.client.color.green)
.setAuthor(message.author.tag, message.author.displayAvatarURL())
.setDescription(`The Current Guild has no Existing Reaction Roles!`)
.setFooter(`https://github.com/peterhanania/reaction-roles`)

message.channel.send(wipeEmbed3)

  return;
}

let wipeEmbed = new MessageEmbed()
.setColor(message.client.color.green)
.setAuthor(message.author.tag, message.author.displayAvatarURL())
.setDescription(`Successfuly deleted **${results.length}** ${resultsHehe} from the guild.`)
.setFooter(`https://github.com/peterhanania/reaction-roles`)


message.channel.send(wipeEmbed)
    }
};