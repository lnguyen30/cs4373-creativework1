import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'


export function addEventListeners(){

    //calls about page after click event
    Element.menuAbout.addEventListener('click', ()=>{
        history.pushState(null, null, Route.routePath.ABOUT);
        about_page();
    })
}

export function about_page(){
    // if user is not logged in
    if(!Auth.currentUser){
        Element.root.innerHTML= '<h1>Access Not Allowed</h1>'
        return;
    }
    // inserts content into  
    Element.root.innerHTML = '<h1>About Page</h1>'
}