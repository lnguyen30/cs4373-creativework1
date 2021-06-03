import * as Constant from '../model/constant.js'
import { Thread } from '../model/thread.js';
import {Reply} from '../model/reply.js'

//calls firebase to sign in user
export async function signIn(email,password){ 
    await firebase.auth().signInWithEmailAndPassword(email, password)
}

// calls firebase to sign out user
export async function signOut(){ 
    await firebase.auth().signOut();
}

// adds thread information to firebase
export async function addThread(thread){
    const ref = await firebase.firestore()
            .collection(Constant.collectionNames.THREADS)
            .add(thread.serialize());
    return ref.id; //primary key assigned

}

// gets all threads from fire store
export async function getThreadList(){
    let threadList = []
    const snapShot = await firebase.firestore()
        .collection(Constant.collectionNames.THREADS)
        .orderBy('timestamp', 'desc')
        .get();

    snapShot.forEach(doc=>{
        const t = new Thread(doc.data())
        t.docId = doc.id
        threadList.push(t)
    });
    return threadList;
}

export async function getOneThread(threadId){
    //searches fire store and retrieves thread based on id
    const ref = await firebase.firestore()
            .collection(Constant.collectionNames.THREADS)
            .doc(threadId)
            .get();
    if(!ref.exists) return null;
    const t = new Thread(ref.data());
    t.docId = threadId
    return t;
}

export async function addReply(reply){
    const ref = await firebase.firestore()
                .collection(Constant.collectionNames.REPLIES)
                .add(reply.serialize());
    return ref.id;
}
//gets all replies into an array
export async function getReplyList(threadId){
    const snapShot = await firebase.firestore()
                .collection(Constant.collectionNames.REPLIES)
                .where('threadId', '==', threadId)
                .orderBy('timestamp')
                .get();
    const replies = [];

    snapShot.forEach(doc=>{
        const r = new Reply(doc.data())
        r.docId = doc.id
        replies.push(r)
    })

    return replies;
}

//searches each thread with search key words
export async function searchThreads(keywordsArray){
    const threadList = []
    const snapShot = await firebase.firestore()
        .collection(Constant.collectionNames.THREADS)
        .where('keywordsArray', 'array-contains-any', keywordsArray)
        .orderBy('timestamp','desc')
        .get()
    snapShot.forEach(doc=>{
        const t = new Thread(doc.data())
        t.docId = doc.id;
        threadList.push(t)
    })
    return threadList;
}

export async function createAccount(email, password){
    await firebase.auth().createUserWithEmailAndPassword(email,password);
}