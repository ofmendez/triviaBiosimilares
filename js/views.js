import {loadViewFile} from './files.js'

const content = document.getElementById('mainId');
const view = function(textView) {
    content.innerHTML = textView;
}
const PageState = function() {
    let currentState = new view("");
    this.change = state => currentState = state;
}
const page = new PageState();

export const GoTo = (viewName) => {
    return new Promise((resolve,reject)=>{
        loadViewFile(viewName).then((res)=>{
            window.history.pushState({}, document.title, window.location.pathname);
            page.change(new view(res));
            resolve(viewName);
        } );
    });
}
