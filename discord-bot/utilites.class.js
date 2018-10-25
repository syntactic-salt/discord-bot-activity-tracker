class Utilities {
    static isUserMessage({ system, channel: { type: channelType }, member: { user: { bot } } }) {
        return channelType === 'text' && system === false && bot === false;
    }
}

module.exports = Utilities;
