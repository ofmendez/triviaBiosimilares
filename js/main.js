import { emailToId, ñ, InsertElement, ConmuteClassAndInner} from './utils.js'
import {createUserData ,getUserData} from "./database.js";
import * as views from "./views.js";
import {loadDataFile} from './files.js'
import * as register from './register.js'

let Questions = {}    
let TotalQuestions = {}    
let countdownTimer = {}
let totalTime = 0 
let aviable5050 = true
let answered = {}
let progress = 0
let totalErrors = 0
let streak = 0
let totalPoints = 0
let pointsBySuccess = 100
let multiplier = 1;
let timeByAns = 5
let timeleft = timeByAns-1
window.views = views

views.GoTo("Wellcome")
// views.GoTo("Instrucciones01").then(()=>successLogin())
// loadDataFile('json')


window.TryLogin = (form)=>{return register.TryLogin(form, successLogin)}

loadDataFile("txt").then((res)=>{
    TotalQuestions = res[0].Questions;
});

const successLogin = () =>{
    ñ("#btnNext").addEventListener('click',()=>{
        views.GoTo("Instrucciones02").then(()=>{
            ñ("#btnStartGame").addEventListener('click',()=> SetLobby() );
        });
    });
} 

const SetLobby = ()=>{
    Questions = TotalQuestions.sort(() => .5 - Math.random()).slice(0,6);
    GoLobby();
}

const GoLobby = ()=>{
    views.GoTo("SeleccionNivel").then((res)=>{
        let questionBtns = ñ('.BotonSeleccionNivel').reverse();
        questionBtns.forEach( (b, i)=> {
            b.classList.add(i===progress?'NivelActual':(i>progress?'NivelBloqueado':'NivelSuperado'));
        });
        questionBtns[progress].addEventListener('click', ()=> GoQuestion(progress) );
    });
}

// b.addEventListener('click', ()=> GoQuestion(b.id) );

//////////////////////////////////////////////

const GoQuestion = (prgs)=>{
    views.GoTo("Pregunta").then((res)=>{
        SetQuestionAndAnswers(Questions[prgs]);
        // SetPowerUp5050(Questions[prgs])
        // SetPowerUpMultiplier()
        RunTimer(Questions[prgs])
    });
}

const SetQuestionAndAnswers = (question)=>{
    ñ('#TituloNivel').innerHTML="NIVEL "+(progress+1)
    ñ('.SeccionPuntaje')[0].innerHTML=totalPoints
    ñ('.TextoPregunta')[0].innerHTML = question.statement;
    for(let ans of question.Answers){
        let a= InsertElement('a', ['BotonRespuesta'],ans.text,ñ('#answersList'),'answer'+ans.id);
        a.addEventListener("click", () => Answer(ans, question));
        InsertElement('span',['TextoAmarillo'],String.fromCharCode(65 + parseInt(ans.id))+': ',a,undefined,true);
        InsertElement('div',['space1vh'],'',ñ('#answersList'));
    }
}


const Answer = (ans, question)=>{
    let classTarget = ans.isCorrect ?'RespuestaCorrecta':'RespuestaIncorrecta';
    // let innerTarget = ans.isCorrect ?'¡Correcto!':'¡Incorrecto!';
    UpdateStatus(timeByAns-timeleft-1, ans.isCorrect)
    AnimateAnswer(ñ('#answer'+ans.id), classTarget,  300);
}

const UpdateStatus = ( time, isCorrect)=>{
    answered[progress] = isCorrect;
    totalErrors += isCorrect? 0 : 1;
    // streak = isCorrect? streak + 1 : 0;
    AccumTime(time)
    if (isCorrect)
        AccumPoints(timeleft+1,pointsBySuccess)
    progress++;
}

const AccumTime = (time)=>{
    totalTime += time;
}

const AccumPoints = (pointsT, pointsS)=>{
    multiplier = 1;
    totalPoints += (pointsT+pointsS*multiplier)
}
const AnimateAnswer = (element, classTarget, interval)=>{
    clearInterval(countdownTimer);
    document.body.classList.add('avoidEvents');
    ConmuteClassAndInner(element,classTarget,'dumb')
    setTimeout(() => {ConmuteClassAndInner(element,'dumb',classTarget)}, interval);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'dumb')}, interval*2);
    setTimeout(() => {ConmuteClassAndInner(element,'dumb',classTarget)}, interval*3);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'dumb')}, interval*4);
    setTimeout(() => {NextQuestionOrResults(); document.body.classList.remove('avoidEvents');}, interval*5);
}

const RunTimer = (question)=>{
    timeleft = timeByAns -1;
    countdownTimer = setInterval(() => {
        ñ(".FondoTiempo")[0].textContent =timeleft
        timeleft--;
        if (timeleft < 0) {
            UpdateStatus(timeByAns, false)
            AnimateAnswer(ñ('#TituloNivel'),'RespuestaIncorrecta', 300);
        }
    }, 1000);//Second by second
}

const NextQuestionOrResults = ()=>{
    if (Object.keys(answered).length === (Questions.length) )
        GoToResults();
    else
        GoLobby();
}