import { emailToId,ñ} from './utils.js'
import {createUserData ,getUserData} from "./database.js";
import * as views from "./views.js";
import {loadDataFile} from './files.js'
import * as register from './register.js'

let Questions = {}    
let countdownTimer = {}
let totalTime = 0 
let aviable5050 = true
let answered = {}
let totalErrors = 0
let streak = 0
let totalPoints = 0
let pointsBySuccess = 100
let multiplier = 1;
let timeByAns = 60
let timeleft = timeByAns-1
window.views = views

views.GoTo("Wellcome")
// views.GoTo("Instrucciones01")

window.TryLogin = (form)=>{return register.TryLogin(form, successLogin)}

// loadDataFile('json')

const SetLobby = ()=>{
    loadDataFile("txt").then((res)=>{
        Questions = res[0].Questions; 
    });
    views.GoTo("SeleccionNivel").then((res)=>{
        let questionBtns =ñ('.BotonSeleccionNivel')
        let ix =0
        for (let b of questionBtns) {
            b.id = ix++; 
            if (b.id in answered){
                b.src ='../Images/IconoPregunta0'+(parseInt(b.id)+1)+(answered[b.id]?'_Bien':'_Mal')+'.svg'
            }else{
                b.classList.add('interactable');
                b.addEventListener('click', ()=> GoQuestion(b.id) );
            }
        }
    });
}



const successLogin = () =>{
    ñ("#btnNext").addEventListener('click',()=>{
        views.GoTo("Instrucciones02").then(()=>{
            ñ("#btnStartGame").addEventListener('click',()=> SetLobby() );
        });
    });
} 

//////////////////////////////////////////////

