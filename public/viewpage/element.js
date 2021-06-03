//form
export const formSearch = document.getElementById('form-search');
export const formSignin = document.getElementById('form-signin');
export const formCreateThread = document.getElementById('form-create-thread');
export const formCreateThreadError ={
    title: document.getElementById('form-create-thread-error-title'),
    keywords: document.getElementById('form-create-thread-error-keywords'),
    content: document.getElementById('form-create-thread-error-content'),
}
export const formCreateAccount = document.getElementById('form-create-account');
export const formCreatAccountError = {
    email: document.getElementById('create-account-error-email'),
    password: document.getElementById('create-account-error-password'),
    passwordConfirm: document.getElementById('create-account-error-passwordConfirm'),

}

//top menu
export const menuSignout = document.getElementById('menu-signout');
export const menuHome = document.getElementById('menu-home');
export const menuAbout = document.getElementById('menu-about');



//modal Bootstrap object
export const  modalSigninForm = new bootstrap.Modal(document.getElementById('modal-signin-form'), {backdrop: 'static'});
export const modalInfoBox = new bootstrap.Modal(document.getElementById('modal-infobox'), {backdrop: 'static'});
export const modalInfoBoxTitleElement = document.getElementById('modal-infobox-title');
export const modalInfoBoxBodyElement = document.getElementById('modal-infobox-body');
export const modalCreateThread = new bootstrap.Modal(document.getElementById('modal-create-thread'),{backdrop: 'static'});
export const modalCreateAccount = new bootstrap.Modal(document.getElementById('modal-create-account'), {backdrop:'static'});

//main content root
export const root = document.getElementById('root');