export class Reply{
    //constructor for reply object
    constructor(data){
        this.threadId = data.threadId;
        this.uid = data.uid;
        this.email = data.email;
        this.timestamp = data.timestamp;
        this.content = data.content;
    }

    //to store in Firestore
    serialize(){
        //jscript object
        return{
            threadId: this.threadId,
            uid: this.uid,
            email: this.email,
            timestamp: this.timestamp,
            content: this.content,
        };
    }
}