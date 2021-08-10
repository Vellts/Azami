module.exports.swap_pages2 = swap_pages2, paginator;

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

const emojiList = ['⏮', '◀️', '▶️', '⏭'],
	timeout = 120000;

async function paginator(client, channel, pages) {
	this.client = client
	let page = 0;
	const curPage = await channel.send({ embeds: [pages[page]] });

	// react to embed with all emojis
	for (const emoji of emojiList) {
		await curPage.react(emoji);
		await client.delay(750);
	}

	// create reactionCollector to update page in embed
	const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot;
	const reactionCollector = await curPage.createReactionCollector(filter, { time: timeout });

	// find out what emoji was reacted on to update pages
	reactionCollector.on('collect', (reaction, user) => {
		if (!user.bot && channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) reaction.users.remove(user.id);
		switch (reaction.emoji.name) {
		case emojiList[0]:
			page = 0;
			break;
		case emojiList[1]:
			page = page > 0 ? --page : 0;
			break;
		case emojiList[2]:
			page = page + 1 < pages.length ? ++page : (pages.length - 1);
			break;
		case emojiList[3]:
			page = pages.length - 1;
			break;
		default:
			break;
		}
		curPage.edit({ embeds: [pages[page]] });
	});

	// when timer runs out remove all reactions to show end of pageinator
	reactionCollector.on('end', () => curPage.reactions.removeAll());
	return curPage;
};
