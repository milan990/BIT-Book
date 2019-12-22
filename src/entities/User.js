export default class User {
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.aboutShort = data.aboutShort;
        this.lastPostDate = data.lastPostDate;
        this.avatarUrl = data.avatarUrl;
    }
}