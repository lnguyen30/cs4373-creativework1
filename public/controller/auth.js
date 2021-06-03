import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from '../viewpage/util.js'
import * as Route from './route.js'
export let currentUser

export function addEventListeners() {// for signing in
  Element.formSignin.addEventListener("submit", async (e) => {
    e.preventDefault();//prevents page from reloading 
    const email = e.target.email.value; // grabs value from the name tag of email
    const password = e.target.password.value;
    try {
      await FirebaseController.signIn(email,password); //passes in the email and password to firebase async sign in function
      Element.modalSigninForm.hide();// hides modal after sign in
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.info('Sign in Error', JSON.stringify(e), Element.modalSigninForm);
    }
  });
  
  //sign user out
  Element.menuSignout.addEventListener('click', () => {
    try {
      FirebaseController.signOut(); // calls firebase async function to signout
    } catch (e) {
      console.log(e);
    }
  });

  //changes state of page based on user signing in/out
  firebase.auth().onAuthStateChanged(user=>{
    if(user){// shows home, about, sign out buttons after signing in
      currentUser = user; // assigns signed in user to current user
      let elements = document.getElementsByClassName('modal-menus-pre-auth');
      for(let i = 0; i<elements.length; i++)
        elements[i].style.display = 'none';
      elements = document.getElementsByClassName('modal-menus-post-auth');
      for(let i = 0; i<elements.length; i++)
        elements[i].style.display = 'block';  
      
        //shows page contents from url and not unauthorized page
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        Route.routing(pathname, hash);

    }else{// displays sign in only after signing out
      currentUser = null;// if user is signed out, currentUser is null
      let elements = document.getElementsByClassName('modal-menus-pre-auth');
      for(let i = 0; i<elements.length; i++)
        elements[i].style.display = 'block';
      elements = document.getElementsByClassName('modal-menus-post-auth');
      for(let i = 0; i<elements.length; i++)
        elements[i].style.display = 'none';

      history.pushState(null, null, Route.routePath.HOME);
     // Element.root.innerHTML = '<h1>Signed Out</h1>'
    }
  });

  Element.formCreateAccount.addEventListener('submit', async e =>{
    e.preventDefault();
    //grabs elements from form
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;

    //reset error messages
    Element.formCreatAccountError.email.innerHTML=''
    Element.formCreatAccountError.password.innerHTML=''
    Element.formCreatAccountError.passwordConfirm.innerHTML=''
    //validates password
    let valid = true;
    if(password.length < 6){
      valid.false;
      Element.formCreatAccountError.password.innerHTML= 'at least 6 characters';
    }
    if(passwordConfirm != password){
      valid =false;
      Element.formCreatAccountError.passwordConfirm.innerHTML='passwords do not match';
    }
    if(!valid) return;

    //passes information to firebase to create user
    try{
      await FirebaseController.createAccount(email,password);
      Util.info('Account Created', 'You are now signed in', Element.modalCreateAccount);
    }catch(e){
      if(Constant.DEV) console.log(e);
      Util.info('Failed to Create Account', JSON.stringify(e), Element.modalCreateAccount);

    }
  })
  
}