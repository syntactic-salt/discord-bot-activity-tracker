const MySQL = require('mysql');
const database = require('../../database');
const Resource = require('./resource.class');

const MySQLCreateConnection = MySQL.createConnection;

class Message extends Resource {
    constructor(id, channelId, memberId) {
        super(id);
        this.channelId = channelId;
        this.memberId = memberId;
    }

    create() {
        return new Promise((resolve, reject) => {
            const connection = new MySQLCreateConnection(database);
            connection.query('INSERT INTO messages SET channel_id = ?, id = ?, member_id = ?, date = NOW()',
                [this.channelId, this.id, this.memberId],
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

module.exports = Message;
