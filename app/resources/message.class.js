const MySQL = require('mysql');
const database = require('../../database');
const Resource = require('./resource.class');

const MySQLCreateConnection = MySQL.createConnection;

class Message extends Resource {
    constructor(discordId, channelId, memberId, databaseId = null) {
        super(discordId, databaseId);
        this.channelId = channelId;
        this.memberId = memberId;
    }

    sync() {
        return this.insertMessagesTable();
    }

    insertMessagesTable() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('INSERT INTO messages SET channel_id = ?, discord_id = ?, member_id = ?',
                [this.channelId, this.discordId, this.memberId],
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        this.databaseId = result.insertId;
                        resolve(this);
                    }

                    connection.destroy();
                });
        });
    }
}

module.exports = Message;
