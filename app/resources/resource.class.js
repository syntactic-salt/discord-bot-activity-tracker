class Resource {
    constructor(discordId, databaseId = null) {
        this.discordId = discordId;
        this.databaseId = databaseId;
    }

    getDatabaseId() {
        return this.databaseId;
    }
}

module.exports = Resource;
