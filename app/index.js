const DiscordJS = require('discord.js');

const Guild = require('./resources/guild.class');
const Channel = require('./resources/channel.class');
const Member = require('./resources/member.class');
const Message = require('./resources/message.class');
const Utils = require('./utilites.class');
const discord = require('../discord');

const client = new DiscordJS.Client();

client.on('ready', () => {
    console.log('Tracking activity...');
});

client.on('message', async (receivedMessage) => {
    if (Utils.isUserMessage(receivedMessage)) {
        const { id: guildId, name: guildName } = receivedMessage.guild;
        const guild = new Guild(guildId, guildName);

        await guild.sync();

        const { id: channelId, name: channelName } = receivedMessage.channel;
        const channel = new Channel(channelId, channelName, guild.getDatabaseId());

        await channel.sync();

        const {
            id: memberId,
            user: {
                discriminator: memberDiscriminator,
                username: memberName,
            },
        } = receivedMessage.member;
        const member = new Member(memberId, memberName, memberDiscriminator, guild.getDatabaseId());

        await member.sync();

        const message = new Message(receivedMessage.id, channel.getDatabaseId(), member.getDatabaseId());

        await message.sync();
    }
});

client.on('disconnect', () => {
    client.login(discord.token);
});

client.login(discord.token);
