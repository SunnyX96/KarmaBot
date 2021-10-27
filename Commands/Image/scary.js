const undici = require('undici');
const Discord = require('discord.js');
const config = require('../../Configs/config');
const emotes = require('../../Configs/emotes');
const Functions = require('../../Base/Functions');

module.exports = {
	help: {
		name: 'scary',
		aliases: [],
		description: 'S-Scary.',
		category: __dirname.split('Commands\\')[1],
	},
	run: async (client, message, args) => {
		const member = client.users.cache.get(args[0])
			? client.users.cache.get(args[0])
			: Functions.getUser(message, args, true);

		if(!member) {
			return message.reply('Could not find the user.');
		}

		const avatar = member.user
			? member.user.displayAvatarURL({ size: 1024, format: 'png' })
			: member.displayAvatarURL({ size: 1024, format: 'png' });

		const m = await message.reply(`${emotes.load} **Please Wait...**`);

		const data = await undici
			.fetch('https://v1.api.amethyste.moe/generate/scary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Bearer ${config.AME_API}`,
				},
				body: `url=${encodeURIComponent(avatar)}`,
			})
			.then((res) => res.arrayBuffer());

		const buffer = Buffer.from(data);

		const attachment = new Discord.MessageAttachment(buffer, 'scary.png');
		message.reply({ files: [attachment] }).then(() => m.delete());
	},
};
