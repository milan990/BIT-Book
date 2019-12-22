export default class Profile {
    constructor(data){
        this.name = data.name;
        this.aboutShort = data.aboutShort;
        this.about = data.about;
        this.avatarUrl = data.avatarUrl;
        this.commentsCount = data.commentsCount;
        this.postsCount = data.postsCount;
        this.email = data.email;
        this.userId = data.userId;
    }
}