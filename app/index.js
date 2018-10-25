const DiscordJS = require('discord.js');
const lodashGet = require('lodash/get');
const MySQL = require('mysql');

const Guild = require('./resources/guild.class');
const Channel = require('./resources/channel.class');
const Member = require('./resources/member.class');
const Message = require('./resources/message.class');
const ResourceCollection = require('./resources/resource-collection.class');
const Utils = require('./utilites.class');
const discord = require('../discord');
const database = require('../database');

const client = new DiscordJS.Client();
const guildsLastChecked = {};

client.on('ready', () => {
    console.log('Tracking activity...');
});

client.on('message', async (receivedMessage) => {
    // exit if this is a direct message
    if (!receivedMessage.guild) return;

    const { id: guildId, name: guildName } = receivedMessage.guild;
    const guild = new Guild(guildId, guildName);

    if (guildId && Utils.isUserMessage(receivedMessage)) {
        guild.sync();

        const { id: channelId, name: channelName } = receivedMessage.channel;
        const channel = new Channel(channelId, channelName, guild.getId());
        channel.sync();

        const { id: memberId, user: { username: memberName } } = receivedMessage.member;
        const member = new Member(memberId, memberName, guild.getId());
        member.sync();

        new Message(receivedMessage.id, channel.getId(), member.getId()).create();
    }

    const guildLastChecked = lodashGet(guildsLastChecked, guild.getId(), Date.now() - 25 * 60 * 60 * 1000);

    if (guildLastChecked < Date.now() - 1 / 6 * 60 * 1000) {
        guild.sync();

        const MySQLCreateConnection = MySQL.createConnection;
        const membersConnection = MySQLCreateConnection(database);

        membersConnection.query('SELECT id, name FROM members WHERE guild_id = ?',
            [guild.getId()],
            (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    const members = new ResourceCollection();

                    results.forEach(({ id: resultId, name: resultName }) => {
                        members.add(new Member(resultId, resultName, guild.getId()));
                    });

                    const latestMembers = new ResourceCollection();

                    receivedMessage.guild.members.forEach((member, memberId) => {
                        const { user: { username: memberName, bot: isBot } } = member;

                        if (!isBot) {
                            latestMembers.add(new Member(memberId, memberName, guild.getId()));
                        }
                    });

                    members.sync(latestMembers);
                }

                membersConnection.destroy();
            });

        const channelsConnection = new MySQLCreateConnection(database);

        channelsConnection.query('SELECT id, name FROM channels WHERE guild_id = ?',
            [guild.getId()],
            (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    const channels = new ResourceCollection();

                    results.forEach(({ id: resultId, name: resultName }) => {
                        channels.add(new Channel(resultId, resultName, guild.getId()));
                    });

                    const latestChannels = new ResourceCollection();

                    receivedMessage.guild.channels.forEach((channel, channelId) => {
                        const { name: channelName, type: channelType } = channel;

                        if (channelType.toLowerCase() === 'text') {
                            latestChannels.add(new Channel(channelId, channelName, guild.getId()));
                        }
                    });

                    channels.sync(latestChannels);
                }

                channelsConnection.destroy();
            });

        guildsLastChecked[guildId] = Date.now();
    }
});

client.on('disconnect', () => client.login(discord.token));

client.login(discord.token);
