class Utilities {
    static isUserMessage({ system, channel: { type: channelType }, member: { user: { bot } } }) {
        return channelType === 'text' && system === false && bot === false;
    }

    static rowParser(row) {
        const parsedRow = {};

        Object.entries(row).forEach(([key, value]) => {
            parsedRow[key] = value;
        });

        return parsedRow;
    }
}

module.exports = Utilities;
