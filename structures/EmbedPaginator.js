module.exports.swap_pages2 = swap_pages2;

/*async function swap_pages(client, message, description, TITLE) {
	this.client = client;
  let currentPage = 0;
  //GET ALL EMBEDS
  let embeds = [];
  //if input is an array
  if (Array.isArray(description)) {
    try {
      let k = 15;
      for (let i = 0; i < description.length; i += 15) {
        const current = description.slice(i, k);
        k += 15;
        const embed = new Discord.MessageEmbed()
          .setDescription(current)
          .setTitle(TITLE)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
        embeds.push(embed);
      }
      embeds;
    } catch {}
  } else {
    try {
      let k = 1000;
      for (let i = 0; i < description.length; i += 1000) {
        const current = description.slice(i, k);
        k += 1000;
        const embed = new Discord.MessageEmbed()
          .setDescription(current)
          .setTitle(TITLE)
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
        embeds.push(embed);
      }
      embeds;
    } catch {}
  }
  if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]] })
  const queueEmbed = await message.channel.send({embeds: [
    `**Current Page - ${currentPage + 1}/${embeds.length}**`,
    embeds[currentPage]
  ]});
  let reactionemojis = ["⬅️", "⏹", "➡️"];
  try {
    for (const emoji of reactionemojis)
      await queueEmbed.react(emoji);
  } catch {}

  const filter = (reaction, user) =>
    (reactionemojis.includes(reaction.emoji.name) || reactionemojis.includes(reaction.emoji.name)) && message.author.id === user.id;
  const collector = queueEmbed.createReactionCollector(filter, {
    time: 45000
  });

  collector.on("collect", async (reaction, user) => {
    try {
      if (reaction.emoji.name === reactionemojis[2] || reaction.emoji.id === reactionemojis[2]) {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        } else {
          currentPage = 0
          queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        }
      } else if (reaction.emoji.name === reactionemojis[0] || reaction.emoji.id === reactionemojis[0]) {
        if (currentPage !== 0) {
          --currentPage;
          queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        } else {
          currentPage = embeds.length - 1
          queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        }
      } else {
        collector.stop();
        reaction.message.reactions.removeAll();
      }
      await reaction.users.remove(message.author.id);
    } catch {}
  });

}*/

async function swap_pages2(client, message, embeds) {
	this.client = client;
  let currentPage = 0;
  if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]})
  queueEmbed = await message.channel.send({
    content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
    embeds: [embeds[currentPage]]}
).catch(e => console.log(e))
  let reactionemojis = ["⬅️", "⏹", "➡️"];
  try {
    for (const emoji of reactionemojis)
      await queueEmbed.react(emoji);
  } catch {}

  const filter = (reaction, user) =>
    (reactionemojis.includes(reaction.emoji.name) || reactionemojis.includes(reaction.emoji.name)) && message.author.id === user.id;
  const collector = queueEmbed.createReactionCollector(filter, {
    time: 45000
  });

  collector.on("collect", async (reaction, user) => {
    try {
      if (reaction.emoji.name === reactionemojis[2] || reaction.emoji.id === reactionemojis[2]) {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          queueEmbed.edit({content: `**Página - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]]});
        } else {
          currentPage = 0
          queueEmbed.edit({content: `**Página - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]]});
        }
      } else if (reaction.emoji.name === reactionemojis[0] || reaction.emoji.id === reactionemojis[0]) {
        if (currentPage !== 0) {
          --currentPage;
          queueEmbed.edit({content: `**Página - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]]});
        } else {
          currentPage = embeds.length - 1
          queueEmbed.edit({content: `**Página - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]]});
        }
      } else {
        collector.stop();
        reaction.message.reactions.removeAll();
      }
      await reaction.users.remove(message.author.id);
    } catch (e){
      console.log(e)
    }
  });
}