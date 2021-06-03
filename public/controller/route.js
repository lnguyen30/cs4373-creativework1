import * as Home from '../viewpage/home_page.js'
import * as About from '../viewpage/about_page.js'
import * as ThreadPage from '../viewpage/thread_page.js'
import * as Search from '../viewpage/search_page.js'

export const routePath = {
    HOME: '/',
    ABOUT: '/about',
    THREAD: '/thread',
    SEARCH: '/search',
}

export const routes = [
    {path: routePath.HOME, page: Home.home_page},
    {path: routePath.ABOUT, page: About.about_page},
    {path: routePath.THREAD, page: ThreadPage.thread_page},
    {path: routePath.SEARCH, page: Search.search_page},

];

export function routing(pathname, hash){
    const route = routes.find(r=>r.path == pathname);
    if (route) {
        if(hash && hash.length > 1) //if hash exists and is greater than 1 including # 
             route.page(hash.substring(1)); //each page will have hash value
        else route.page();
    }else routes[0].page();
}
