const MySQL = require('mysql');
const database = require('../database');
const Resource = require('./resource.class');

const MySQLCreateConnection = MySQL.createConnection;

class Channel extends Resource {
    constructor(id, channelName, guildId) {
        super(id);
        this.guildId = guildId;
        this.name = channelName;
    }

    sync() {
        return new Promise((resolve, reject) => {
            this.fetch().then((results) => {
                if (results.length) {
                    const { name } = results[0];

                    if (this.name === name) {
                        resolve(this);
                    } else {
                        this.update().then(() => resolve(this)).catch(error => reject(error));
                    }
                } else {
                    this.create().then(() => resolve(this)).catch(error => reject(error));
                }
            }).catch(error => reject(error));
        });
    }

    equalTo(channel) {
        return channel.id === this.id && channel.name === this.name && channel.guildId === this.guildId;
    }

    fetch() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('SELECT name FROM channels WHERE id = ?',
                [this.id],
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

    create() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('INSERT INTO channels SET id = ?, name = ?, guild_id = ?',
                [this.id, this.name, this.guildId],
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

    update() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('UPDATE channels SET name = ? WHERE id = ?',
                [this.name, this.id],
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

    remove() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('DELETE FROM channels WHERE id = ?',
                [this.id],
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
