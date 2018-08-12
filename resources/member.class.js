class Member {
    constructor({ id, user: { discriminator, username } }) {
        this.id = id;
        this.username = username;
        this.discriminator = discriminator;
    }
}


module.exports = Member;
