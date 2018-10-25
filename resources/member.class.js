const MySQL = require('mysql');
const database = require('../database');
const Resource = require('./resource.class');

const MySQLCreateConnection = MySQL.createConnection;

class Member extends Resource {
    constructor(id, memberName, guildId) {
        super(id);
        this.guildId = guildId;
        this.name = memberName;
    }

    equalTo(member) {
        return member.id === this.id && member.name === this.name && member.guildId === this.guildId;
    }

    sync() {
        return new Promise((resolve, reject) => {
            this.fetch().then((results) => {
                if (results.length) {
                    const { name } = results[0];

                    if (name === this.name) {
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
            connection.query('SELECT name FROM members WHERE id = ? AND guild_id = ?',
                [this.id, this.guildId],
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
            connection.query('INSERT INTO members SET name = ?, id = ?, guild_id = ?',
                [this.name, this.id, this.guildId],
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
            connection.query('UPDATE members SET name = ? WHERE id = ?',
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
            connection.query('DELETE FROM members WHERE id = ?',
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

module.exports = Member;
