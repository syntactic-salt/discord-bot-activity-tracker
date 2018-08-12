class Utilities {
    static isUserMessage(message) {
        return message.channel.type === 'text' && message.system === false && message.member.user.bot === false;
    }
}

module.exports = Utilities;
