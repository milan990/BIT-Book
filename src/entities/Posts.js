export default class Post {
    constructor(data){
        this.text = data.text;
        this.id = data.id;
        this.dateCreated = data.dateCreated;
        this.userId = data.userId;
        this.userDisplayName = data.userDisplayName;
        this.imageUrl = data.imageUrl;
        this.videoUrl = data.videoUrl;
        this.type = data.type;
        this.commentsNum = data.commentsNum;
    }
}