import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import { Thread } from '../model/thread.js';
import * as Constant from '../model/constant.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Util from './util.js'
import * as ThreadPage from './thread_page.js'

export function addEventListeners(){

    //navigates to home page
    Element.menuHome.addEventListener('click', async ()=>{
        history.pushState(null, null, Route.routePath.HOME);
        //disables home button
        const label = Util.disableButton(Element.menuHome);
        await home_page(); // calls home page function
        await Util.sleep(1000);//1 second time delay
        //enables home button after home page rendered
        Util.enableButton(Element.menuHome, label);
    })

    //creates thread from new thread form
    Element.formCreateThread.addEventListener('submit', async e =>{
        e.preventDefault();//prevents page from reloading

        //fetching button by tag from create form
        const button = Element.formCreateThread.getElementsByTagName('button')[0]; 

        const label = Util.disableButton(button); //disables button after clicking Create
        //await Util.sleep(1000);

        //removes error once each field is corrected 
        Element.formCreateThreadError.title.innerHTML = '';
        Element.formCreateThreadError.keywords.innerHTML='';
        Element.formCreateThreadError.content.innerHTML='';

        //grabs value from new thread form
        //trim takes out blank spaces
        const title = e.target.title.value.trim();
        const content = e.target.content.value.trim();
        const keywords = e.target.keywords.value.trim();
        //grabs the current user's info
        const uid = Auth.currentUser.uid;
        const email = Auth.currentUser.email;
        const timestamp = Date.now(); //extract date info
        const keywordsArray = keywords.toLowerCase().match(/\S+/g); //regex to parse through the array
        //call new thread object
        const thread = new Thread({
            uid, title, content, email, timestamp, keywordsArray
        });

        
        //validate thread by validation functions
        let valid = true;
        let error = thread.validate_title();
        if(error){
            valid = false;
            Element.formCreateThreadError.title.innerHTML = error;
        }

        error = thread.validate_keywords();
        if(error){
            valid = false;
            Element.formCreateThreadError.keywords.innerHTML = error;
        }
        error = thread.validate_content();
        if(error){
            valid = false;
            Element.formCreateThreadError.content.innerHTML = error;
        }

        if(!valid){
            Util.enableButton(button,label); //resetting button
            return;
        }

        try{
            // id of new thread is passed into docId
           const docId = await FirebaseController.addThread(thread); 
           thread.docId = docId;
           //update page with all threads, will change later
           //home_page();

           //updates and builds table after new 
           const trTag = document.createElement('tr'); // start of tr tag
           trTag.innerHTML = buildThreadView(thread); //fills row of info from form
           const threadTableBody = document.getElementById('thread-table-body');//inserts new row
           threadTableBody.prepend(trTag); //adds row to top of table
           //bug fix
           const viewForms = document.getElementsByClassName('thread-view-form');//arrary of thread forms
           ThreadPage.addViewFormSubmitEvent(viewForms[0]); //adds event listener to new thread added

           //if no threads message does exists, convert it to blank
           const noThreadFound =document.getElementById('no-thread-found');
           if (noThreadFound)
               noThreadFound.innerHTML = ''
           e.target.reset(); //resets form after row has been added

        
           Util.info('Success', 'A new thread has been added', Element.modalCreateThread);
        }catch(e){
            if(Constant.DEV) console.log(e);
            Util.info('Failed to add', JSON.stringify(e), Element.modalCreateThread);
        }
        Util.enableButton(button, label);
    })
}

// contents for home page
export async function home_page(){
    // if user is not logged in
    if(!Auth.currentUser){
        Element.root.innerHTML= '<h1>Access Not Allowed</h1>'
        return;
    }

    let threadList;
    try{
        //grabs threads from firebase
        threadList = await FirebaseController.getThreadList();
    }catch(e){
        if(Constant.DEV) console.log(e);
        Util.info('Error to get thread list', JSON.stringify(e));
    }

    //displays list after retrieving threads from firestore
    buildHomeScreen(threadList);

   /*  //places content into root element tag
    Element.root.innerHTML = `
        <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-create-thread"
            >+ New Thread</button>
    `; */
}

// constructs home screen with threads
export function buildHomeScreen(threadList){
    let html =''
    html+=`
        <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-create-thread"
        >+ New Thread</button>
    `;

    // renders table
    html +=`
    <table class="table table-striped">
    <thead>
        <tr>
        <th scope="col">Action</th>
        <th scope="col">Title</th>
        <th scope="col">Keywords</th>
        <th scope="col">Posted By</th>
        <th scope="col">Content</th>
        <th scope="col">Posted At</th>
        </tr>
    </thead>
    <tbody id="thread-table-body">
    `

    threadList.forEach(thread=>{
        //builds each row of thread
        html += `
        <tr>
        ${buildThreadView(thread)}
        </tr>
        `
    })

    html +='</tbody></table>'
    Element.root.innerHTML = html;

    // if there are no threads, display no threads message
    if (threadList.length == 0){
        html += '<h4 id="no-thread-found">No Threads Found</h4>'
        Element.root.innerHTML = html;
        return;
    }


    ThreadPage.addViewButtonListeners();
}

function buildThreadView(thread){
    //when view button is clicked, the form will appear with the threads details
    // if user doesn't have any keywords, then keywords array is '' 
    return `
        <td>
            <form method="post" class="thread-view-form">
                <input type="hidden" name="threadId" value="${thread.docId}">
                <button type="submit" class="btn btn-outline-primary">View</button>
            </form>
        </td>
        <td>${thread.title}</td>
        <td>${!thread.keywordsArray || !Array.isArray(thread.keywordsArray) ? '': thread.keywordsArray.join(' ')}</td>
        <td>${thread.email}</td>
        <td>${thread.content}</td>
        <td>${new Date(thread.timestamp).toString()}</td>
    `
}