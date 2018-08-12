class Channel {
    constructor({ id, name: channelName, guild: { id: guildId } }) {
        this.id = id;
        this.guildId = guildId;
        this.channelName = channelName;
    }
}

module.exports = Channel;
