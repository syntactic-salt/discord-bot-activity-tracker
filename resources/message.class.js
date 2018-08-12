class Message {
    constructor({
        id,
        channel: {
            id: channelId,
        },
        guild: {
            id: guildId,
        },
        member: {
            id: memberId,
        },
        createdAt: date,
    }) {
        this.id = id;
        this.channelId = channelId;
        this.guildId = guildId;
        this.memberId = memberId;
        this.date = date;
    }
}

module.exports = Message;
