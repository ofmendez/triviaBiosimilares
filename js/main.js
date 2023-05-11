import { ñ, InsertElement, ConmuteClassAndInner, RandomInt} from './utils.js'
import * as views from "./views.js";
import {loadDataFile} from './files.js'
import * as register from './register.js'

let Questions = {}    
let TotalQuestions = {}    
let countdownTimer = {}
let pausedTime = false
let aviable5050 = true
let aviableClue = true
let answered = {}
let progress = 0
let totalPoints = 0
let pointsBySuccess = 100
let multiplier = 1;
let timeByAns = 30
let timeleft = timeByAns-1
window.views = views

views.GoTo("Wellcome")

// views.GoTo("Ranking")
// views.GoTo("Instrucciones01").then(()=>successLogin())
// loadDataFile('json')

window.TryLogin = (form)=>{return register.TryLogin(form, successLogin,GoToRanking)}

loadDataFile("txt").then((res)=>{
    TotalQuestions = res[0].Questions;
});

const successLogin = () =>{
    views.GoTo("Instrucciones01").then(()=>{
        ñ("#btnNext").addEventListener('click',()=>{
            views.GoTo("Instrucciones02").then(()=>{
                ñ("#btnStartGame").addEventListener('click',()=> SetLobby() );
            });
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

//////////////////////////////////////////////

const GoQuestion = (prgs)=>{
    views.GoTo("Pregunta").then((res)=>{
        SetQuestionAndAnswers(Questions[prgs]);
        SetPowerUp5050(Questions[prgs])
        SetPowerUpClue(Questions[prgs])
        RunTimer(Questions[prgs])
    });
}

const SetQuestionAndAnswers = (question)=>{
    ñ('#TituloNivel').innerHTML="NIVEL "+(progress+1)
    ñ('.SeccionPuntaje')[0].innerHTML=totalPoints
    ñ('.TextoPregunta')[0].innerHTML = question.statement;
    for(let ans of question.Answers){
        // if(ans.isCorrect) console.log(String.fromCharCode(65 + parseInt(ans.id)));
        let a= InsertElement('a', ['BotonRespuesta'],ans.text,ñ('#answersList'),'answer'+ans.id);
        a.addEventListener("click", () => Answer(ans, question));
        InsertElement('span',['TextoAmarillo'],String.fromCharCode(65 + parseInt(ans.id))+': ',a,undefined,true);
        InsertElement('div',['spaceMediumvh'],'',ñ('#answersList'));
    }
}


const Answer = (ans, question)=>{
    let classTarget = ans.isCorrect ?'RespuestaCorrecta':'RespuestaIncorrecta';
    UpdateStatus(timeByAns-timeleft-1, ans.isCorrect)
    AnimateAnswer(question,ñ('#answer'+ans.id), classTarget,  300);
}

const UpdateStatus = ( time, isCorrect)=>{
    answered[progress] = isCorrect;
    if (isCorrect)
        AccumPoints(timeleft+1,pointsBySuccess*(progress+1))
    progress++;
}

const AccumPoints = (pointsT, pointsS)=>{
    console.log("suma: ",pointsS);
    multiplier = 1;
    totalPoints += (pointsT+pointsS*multiplier)
}
const AnimateAnswer = (q, element, classTarget, interval)=>{
    clearInterval(countdownTimer);
    document.body.classList.add('avoidEvents');
    ConmuteClassAndInner(element,classTarget,'dumb')
    setTimeout(() => {ConmuteClassAndInner(element,'dumb',classTarget)}, interval);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'dumb')}, interval*2);
    setTimeout(() => {ConmuteClassAndInner(element,'dumb',classTarget)}, interval*3);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'dumb')}, interval*4);
    setTimeout(() => {ShowFinalMessage(q); document.body.classList.remove('avoidEvents');}, interval*5);
}

const RunTimer = (question)=>{
    timeleft = timeByAns -1;
    countdownTimer = setInterval(() => {
        ñ(".FondoTiempo")[0].textContent =timeleft
        timeleft = pausedTime? timeleft: timeleft -1;
        if (timeleft < 0) {
            UpdateStatus(timeByAns, false)
            AnimateAnswer(question,ñ('#TituloNivel'),'RespuestaIncorrecta', 300);
        }
    }, 1000);
}


const ShowFinalMessage = (q)=>{
    ñ("#contentFinalMsg").innerHTML = q.popup;
    ñ("#finalMessage").removeAttribute("nodisplay");
    ñ("#nextQuestion").addEventListener('click',()=>{
        NextQuestionOrResults();
    });
}


const NextQuestionOrResults = ()=>{
    if (Object.keys(answered).length === (Questions.length) )
        GoToResults();
    else
        GoLobby();
}
const GoToResults = ()=>{
    document.body.classList.add('avoidEvents');
    views.GoTo("Resultados").then((res)=>{
        ñ("#btnGoRank").addEventListener('click',()=> GoToRanking());
        ñ('#score').innerHTML = totalPoints;
        document.body.classList.remove('avoidEvents');
    });
}

const GoToRanking = (q)=>{
    views.GoTo("Ranking").then(()=>{
        let listaIndices = []//JSON.parse(localStorage.getItem("listaIndices") ||JSON.stringify([]));
        FillRanking(listaIndices);
    });
}

const FillRanking = (listaIndices)=>{
    let users = []
    for (const i in listaIndices) {
        let user ={}
        user.username= localStorage.getItem("Nombre_"+listaIndices[i] );
        user.score= localStorage.getItem("Puntos_"+listaIndices[i] );
        users.push(user);
    }
    users.sort((a, b) => { return b.score - a.score; });
    
    let container = document.getElementById('tablasRR');
    let tables = InsertElement('table',[],'',container);
    for (let i = 0; i < users.length; i++) {
        let tr = InsertElement('tr',['EstiloPuntaje'],'',tables);
        InsertElement('th',['PosicionJugadorRanking'],'#'+(i+1),tr);
        InsertElement('th',['NombreJugadorRanking'],users[i].username,tr);
        InsertElement('th',['PuntajeJugadorRanking'],users[i].score,tr);
    }
}

const SetPowerUp5050 = (q)=>{
    if(aviable5050)
        ñ('#powerUp5050').removeAttribute("grayscale");
    ñ('#powerUp5050').addEventListener('click', () =>{
        ñ('#powerUp5050').setAttribute("grayscale", true);
        Use5050(q)
    });
}

const SetPowerUpClue = (q)=>{
    ñ("#contentClue").innerHTML = q.ayuda;
    if(aviableClue)
        ñ('#powerUpClue').removeAttribute("grayscale");
    ñ('#powerUpClue').addEventListener('click', () =>{
        aviableClue = false;
        ñ('#powerUpClue').setAttribute("grayscale", true);
        UseClue(q)
    });
}

const UseClue = (q)=>{
    pausedTime = true;
    ñ("#modalClue").removeAttribute("nodisplay");
    ñ("#closeClue").addEventListener('click', ()=>{
        ñ("#modalClue").setAttribute("nodisplay", true);
        pausedTime = true;
        pausedTime = false;
    });
}

const Use5050 = (q)=>{
    aviable5050 = false;
    let idWrong1 = -1
    let idWrong2 = -1
    while(idWrong1 < 0  ){
        let n1 = RandomInt(4) 
        if(q.Answers[n1].isCorrect)
            continue
        idWrong1 = n1
    }
    while(idWrong2 < 0  ){
        let n2 = RandomInt(4) 
        if(q.Answers[n2].isCorrect || n2 === idWrong1)
            continue
        idWrong2 = n2
    }
    AnimateWithTransparent( ñ('#answer'+idWrong1), ñ('#answer'+idWrong2),150);
}

export function AnimateWithTransparent(el1, el2, interval) {
    document.body.classList.add('avoidEvents');

    el1.setAttribute('transparent',true);
    el2.setAttribute('transparent',true);

    setTimeout(() => { el1.removeAttribute('transparent'); el2.removeAttribute('transparent');}, interval);
    setTimeout(() => { el1.setAttribute('transparent',true); el2.setAttribute('transparent',true);}, interval*2);
    setTimeout(() => { el1.removeAttribute('transparent'); el2.removeAttribute('transparent');}, interval*3);
    setTimeout(() => { 
        el1.setAttribute('transparent',true); el2.setAttribute('transparent',true); 
        document.body.classList.remove('avoidEvents');
    }, interval*4);
}