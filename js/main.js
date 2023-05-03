import { emailToId} from './utils.js'
import {createUserData ,getUserData} from "./database.js";
import * as views from "./views.js";


window.views = views

views.GoTo("Wellcome")

window.TryLogin = (form)=>{
    Login(form);return true;
    getUserData().then((res)=>{
        let exist = false
        for (const u in res) 
            if (res.hasOwnProperty(u)) 
                exist |= u===emailToId(form.elements['idCorreo'].value)
        if(exist)
            GoRanking()
        else
            Login(form)
        return false;

    }).catch((res)=> {
        console.log("Error login: "+res)
        alert("Ranking, Ha ocurrido un error, intente nuevamente.")
        return false;
    });
    return false;
}



const Login = (form)=>{
    views.GoTo("Instrucciones01");return true;
    createUserData(
        emailToId(form.elements['idCorreo'].value),
        form.elements['idCorreo'].value,
        form.elements['idNombreCompleto'].value,
        form.elements['idEmpresa'].value,
        form.elements['idAssesment'].value,
        form.elements['idMailbox'].value
    ).then((res)=>{
        userID = emailToId(form.elements['idCorreo'].value);
        views.GoTo("Instrucciones01")
    }).catch(()=> {
        alert("Ha ocurrido un error, intente nuevamente.")
    })
}




//////////////////////////////////////////////

