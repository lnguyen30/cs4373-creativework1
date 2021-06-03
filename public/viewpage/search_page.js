import * as Element from './element.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Home from './home_page.js'
import * as Route from '../controller/route.js'

export function addEventListeners(){
    Element.formSearch.addEventListener('submit', async e =>{
        e.preventDefault();
        const searchKeys = e.target.searchKeys.value.trim();
        //if there are no search keys
        if (searchKeys.length == 0){
            Util.info('Error', 'No search keys')
            return;
        }

        //disables button until search finishes
        const button = Element.formSearch.getElementsByTagName('button')[0];
        const label = Util.disableButton(button);
        await Util.sleep(1000);
        // keys are stored in firebase as lowercase
        // S -> any non whitespace char, + -> repeat for every keys, g->match for every key
        //search keys into one string, navigate through url
        const searchKeysInArray = searchKeys.toLowerCase().match(/\S+/g);
        const joinedSearchKeys = searchKeysInArray.join('+')
        //adds search keys to url
        history.pushState(null, null, Route.routePath.SEARCH + '#' + joinedSearchKeys)
        await search_page(joinedSearchKeys); 
        Util.enableButton(button, label); //once search_page finishes, search button resets
    })
}

export async function search_page(joinedSearchKeys){

    if(!joinedSearchKeys){
        Util.info('Error', 'No search keys')
        return;
    }
    //converts back to arrays of search keys
    const searchKeysInArray = joinedSearchKeys.split('+');
    if(searchKeysInArray.length == 0){
        Util.info('Error', 'No search keys')
        return;
    }
    //if user is not authorized 
    if(!Auth.currentUser){
        Element.root.innerHTML='<h1>Protected Page</h1>'
    }

    let threadList
    try{
        //calls firebase to retrieve threads with search keys
        threadList = await FirebaseController.searchThreads(searchKeysInArray);
    }catch(e){
        if(Constant.DEV) console.log(e)
        Util.info('Search Error', JSON.stringify(e));
        return;
    }

    //renders page with threads from search
    Home.buildHomeScreen(threadList);

}