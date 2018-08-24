const MySQL = require('mysql');
const database = require('../../database');
const Resource = require('./resource.class');

const MySQLCreateConnection = MySQL.createConnection;

class Guild extends Resource {
    constructor(discordId, guildName, databaseId = null) {
        super(discordId, databaseId);
        this.name = guildName;
    }

    sync() {
        return new Promise((resolve, reject) => {
            this.selectGuildsTable().then((results) => {
                if (results.length) {
                    const { id: resultId, name: resultName } = results[0];

                    this.databaseId = resultId;

                    if (this.name === resultName) {
                        resolve(this);
                    } else {
                        this.updateGuildsTable().then(() => resolve(this)).catch(error => reject(error));
                    }
                } else {
                    this.insertGuildsTable().then((result) => {
                        this.databaseId = result.insertId;
                        resolve(this);
                    }).catch(error => reject(error));
                }
            }).catch(error => reject(error));
        });
    }

    selectGuildsTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('SELECT id, name FROM guilds WHERE discord_id = ?', [this.discordId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }

                connection.destroy();
            });
        });
    }

    insertGuildsTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('INSERT INTO guilds SET name = ?, discord_id = ?',
                [this.name, this.discordId],
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

    updateGuildsTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('UPDATE guilds SET name = ? WHERE id = ?',
                [this.name, this.databaseId],
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
        });
    }
}

module.exports = Guild;
