const Discord = require('discord.js');
const auth = require('./auth');
const Member = require('./resources/member.class');
const Guild = require('./resources/guild.class');
const Channel = require('./resources/channel.class');
const Message = require('./resources/message.class');
const Utils = require('./utilities/utilites.class');

const members = [];
const guilds = [];
const channels = [];
const messages = [];

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Tracking activity...');
});

client.on('message', (message) => {
    if (Utils.isUserMessage(message)) {
        messages.push(new Message(message));
    }

    const guild = new Guild(message.guild);
    const guildIndex = guilds.findIndex(value => value.id === guild.id);

    if (guildIndex === -1) {
        guilds.push(guild);
    } else if (guilds[guildIndex].guildName !== guild.guildName) {
        guilds[guildIndex] = guild;
    }

    const channel = new Channel(message.channel);
    const channelIndex = channels.findIndex(value => value.id === channel.id);

    if (channelIndex === -1) {
        channels.push(channel);
    } else if (channels[channelIndex].channelName !== channel.channelName) {
        channels[channelIndex] = channel;
    }

    const member = new Member(message.member);
    const memberIndex = members.findIndex(value => value.id === member.id);

    if (memberIndex === -1) {
        members.push(member);
    } else if (members[memberIndex].username !== member.username) {
        members[memberIndex] = member;
    }

    let { content } = message;

    if (content.charAt(0) === '!') {
        content = content.substr(1);

        switch (content) {
        case 'guilds':
            console.log(guilds);
            break;
        case 'messages':
            console.log(messages);
            break;
        case 'members':
            console.log(members);
            break;
        case 'channels':
            console.log(channels);
            break;
        default:
            console.log(`unrecognized command: ${content}`);
        }
    }
});

client.login(auth.token);
