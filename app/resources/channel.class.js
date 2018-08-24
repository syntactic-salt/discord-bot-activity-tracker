const MySQL = require('mysql');
const database = require('../../database');
const Resource = require('./resource.class');

const MySQLCreateConnection = MySQL.createConnection;

class Channel extends Resource {
    constructor(discordId, channelName, guildId, databaseId = null) {
        super(discordId, databaseId);
        this.guildId = guildId;
        this.name = channelName;
    }

    sync() {
        return new Promise((resolve, reject) => {
            this.selectChannelsTable().then((results) => {
                if (results.length) {
                    const { id: resultId, name: resultName } = results[0];

                    this.databaseId = resultId;

                    if (this.name !== resultName) {
                        resolve(this);
                    } else {
                        this.updateChannelsTable().then(() => resolve(this)).catch(error => reject(error));
                    }
                } else {
                    this.insertChannelsTable().then((result) => {
                        this.databaseId = result.insertId;
                        resolve(this);
                    }).catch(error => reject(error));
                }
            }).catch(error => reject(error));
        });
    }

    selectChannelsTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('SELECT id, name FROM channels WHERE discord_id = ?',
                [this.discordId],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }

                    connection.destroy();
                });
        });
    }

    insertChannelsTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('INSERT INTO channels SET name = ?, discord_id = ?, guild_id = ?',
                [this.name, this.discordId, this.guildId],
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                    connection.destroy();
                });
        });
    }

    updateChannelsTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('UPDATE channels SET name = ? WHERE id = ?',
                [this.name, this.databaseId],
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                    connection.destroy();
                });
        });
    }
}

module.exports = Channel;
