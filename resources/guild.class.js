const MySQL = require('mysql');
const database = require('../database');
const Resource = require('./resource.class');

const MySQLCreateConnection = MySQL.createConnection;

class Guild extends Resource {
    constructor(id, guildName) {
        super(id);
        this.name = guildName;
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

    fetch() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('SELECT name FROM guilds WHERE id = ?',
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
            connection.query('INSERT INTO guilds SET name = ?, id = ?',
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

    update() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('UPDATE guilds SET name = ? WHERE id = ?',
                [this.name, this.id],
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
