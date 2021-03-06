import * as Auth from '../controller/auth.js'
import * as Element from './element.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Util from './util.js'
import * as Const from '../model/constant.js'
import {Reply} from '../model/reply.js';
import * as  Route from '../controller/route.js'

export function addViewButtonListeners(){
    //grabs all the forms/values based on the class name
    const viewButtonForms = document.getElementsByClassName('thread-view-form');
    for (let i = 0; i<viewButtonForms.length; i++){
        addViewFormSubmitEvent(viewButtonForms[i])
    }
}

export function addViewFormSubmitEvent(form){
    form.addEventListener('submit', async e=>{
        e.preventDefault();
        const button = e.target.getElementsByTagName('button')[0]
        const label = Util.disableButton(button);
        //await Util.sleep(1000);
        // grabs the row's thread id from after clicking view
        const threadId = e.target.threadId.value;
        //adds id to path url 
        history.pushState(null, null, Route.routePath.THREAD + '#' + threadId)
        await thread_page(threadId);
        Util.enableButton(button, label);
    })
}


// event listener function to delete replies
export function addDeleteEventListeners(deleteform){

    for( let i = 0; i<deleteform.length; i++){
        deleteform[i].addEventListener('submit', async e =>{
            //prevents page from reloading
            e.preventDefault();
            //retrieves button label value
            const button = e.target.getElementsByTagName('button')[0];
            //temporarily disables button
            const label = Util.disableButton(button);

            try{
            // passes docId value from reply form to deleteReply firebase fucnction
            await FirebaseController.deleteReply(e.target.docId.value);
            //removes the reply by the id from the reply card
            const deleteTag = document.getElementById('card-'+ e.target.docId.value);
            deleteTag.remove();

            Util.info('Success', 'Reply Delete');
            }catch(e){
                if(Const.DEV) console.log(e);
                Util.info('Delete Reply Error', JSON.stringify(e))
            }
           
            //re-enables button
            Util.enableButton(button, label);
        })
    }

}

 export async function thread_page(threadId){
    if(!Auth.currentUser){
        Element.root.innerHTML = '<h1>Protected Page</h1>'
    }

    if(!threadId){
        Util.info('Error', 'Thread Id is null; invalid access')
        return;
    }

    let thread
    let replies // array of replies to thread
    try{
        thread = await FirebaseController.getOneThread(threadId)
        if(!thread){
            Util.info('Error', 'Thread does not exist');
            return;
        }
        //fetches all replies for thread from firebases function and stores
        // it into an array
        replies = await FirebaseController.getReplyList(threadId)
    }catch(e){
        if(Const.DEV) console.log(e);
        Util.info('Error', JSON.stringify(e));
        return;
    }
    //renders selected thread
    let html = `
        <h4 class="bg-primary text-white">${thread.title}</h4>
        <div>${thread.email} (At ${new Date(thread.timestamp).toString()})  </div>
        <div class="bg-secondary text-white" >${thread.content}</div>
        <hr>
    `;

    //renders reply list
    html += '<div id="message-reply-body">'
    if(replies && replies.length > 0){
        replies.forEach( r=>{
            html += buildReplyView(r)
        })
    }
    html += '</div>'

    //add new reply
    html += `
        <div>
            <textarea id="textarea-add-new-reply" placeholder="Reply to this thread"></textarea>
            <br>
            <button id="button-add-new-reply" class="btn btn-outline-info">Post Reply</button>
        </div>
    `

    // will render the thread at the root tag
    Element.root.innerHTML = html;

    document.getElementById('button-add-new-reply').addEventListener('click', async ()=>{
        //grabs content of thread   
        const content = document.getElementById('textarea-add-new-reply').value;
        //grabs info of user 
        const uid = Auth.currentUser.uid;
        const email = Auth.currentUser.email;
        const timestamp = Date.now();
        //constructs new reply object
        const reply = new Reply({
            uid, email, timestamp, content, threadId, 
        });

        const button = document.getElementById('button-add-new-reply');
        const label = Util.disableButton(button);

        try{
            const docId = await FirebaseController.addReply(reply);
            // const deleteRepliesForm = document.getElementsByClassName('form-delete-reply');
            // addDeleteEventListeners(deleteRepliesForm);

            reply.docId = docId;
        }catch(e){
            if (Const.DEV) console.log(e);
            Util.info('Error', JSON.stringify(e));
        }

        const replyTag = document.createElement('div')
        replyTag.innerHTML = buildReplyView(reply) // builds reply box

        

        //apends new replies at the bottom of each reply
        document.getElementById('message-reply-body').appendChild(replyTag)
        //clears reply box
        document.getElementById('textarea-add-new-reply').value = ''

        Util.enableButton(button, label);

        // whenever new reply is made, delete reply event listener is added to new replies
        const deleteRepliesForm = document.getElementsByClassName('form-delete-reply');
        addDeleteEventListeners(deleteRepliesForm);

    })

    
     

    //each time the thread page is rendered, delete replies event listeners are added to each replies
    const deleteRepliesForm = document.getElementsByClassName('form-delete-reply');
    addDeleteEventListeners(deleteRepliesForm);
    

}

// add <input type="hidden" name="uid" value=${reply.uid}> to compare current user to reply's uid?
//builds replies for threads
function buildReplyView(reply){
    return `
        <div id="card-${reply.docId}" class="card border border-primary">
            <div class="card-header bg-info text-white">
                Replied by ${reply.email} (At ${new Date(reply.timestamp).toString()})
            </div>
                <div class="card-body">
                <p class="card-text"> ${reply.content} </p>
                <form class="form-delete-reply" method="post">
                    <input type="hidden" name="docId" value=${reply.docId}>
                    <button class="btn btn-outline-danger" type="post">Delete</button>
                </form>
            </div>
        </div>
        <br>
    `;

}
/* 1. get thread from Firestore by ID 
2. get all replies to this thread
3. dipslay it to the thread
4. display all reply messages
5. add a form for a new reply */

// 1. render delete reply button
// 2. event listener for delete reply button
// 3. firebase cloud function in controller 
// 4. client side 
// 5. render on thread page
