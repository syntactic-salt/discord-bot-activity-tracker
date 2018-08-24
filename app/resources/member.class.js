const MySQL = require('mysql');
const database = require('../../database');
const Resource = require('./resource.class');

const MySQLCreateConnection = MySQL.createConnection;

class Member extends Resource {
    constructor(discordId, memberName, discordDiscriminator, guildId, databaseId = null) {
        super(discordId, databaseId);
        this.guildId = guildId;
        this.username = memberName;
        this.discriminator = discordDiscriminator;
    }

    sync() {
        return new Promise((resolve, reject) => {
            this.selectMembersTable().then((results) => {
                if (results.length) {
                    const { id: resultId, username: resultName } = results[0];

                    this.databaseId = resultId;

                    if (resultName !== this.username) {
                        return this.updateMembersTable().catch(error => reject(error));
                    }

                    return results;
                }

                return this.insertMembersTable().then((result) => {
                    this.databaseId = result.insertId;
                }).catch(error => reject(error));
            }).then(() => {
                this.selectMembersToGuildsTable().then((results) => {
                    if (!results.length) {
                        this.insertMembersToGuildsTable().then(() => {
                            resolve(this);
                        }).catch(error => reject(error));
                    }

                    resolve(this);
                }).catch(error => reject(error));
            }).catch(error => reject(error));
        });
    }

    selectMembersTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('SELECT id, username FROM members WHERE discord_id = ?',
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

    insertMembersTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('INSERT INTO members SET username = ?, discriminator = ?, discord_id = ?',
                [this.username, this.discriminator, this.discordId],
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

    updateMembersTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('UPDATE members SET username = ? WHERE id = ?',
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

    selectMembersToGuildsTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('SELECT id FROM guilds_to_members WHERE member_id = ? AND guild_id = ?',
                [this.databaseId, this.guildId],
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

    insertMembersToGuildsTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('INSERT INTO guilds_to_members SET member_id = ?, guild_id = ?',
                [this.databaseId, this.guildId],
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

module.exports = Member;
