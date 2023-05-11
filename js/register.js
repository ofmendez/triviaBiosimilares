import {createUserData ,getUserData} from "./database.js";
import { emailToId} from './utils.js'

export const TryLogin = (form,successLogin,goRank) => {
    getUserData().then((res)=>{
        let exist = false
        for (const u in res) 
            if (res.hasOwnProperty(u)) 
                exist |= u===emailToId(form.elements['idCorreo'].value)
        if(exist)
            goRank()
        else
            Login(form,successLogin)

    }).catch((res)=> {
        console.log("Error login: "+res)
        return false;
    });
    return false;/*
    */
}
const Login = (form,successLogin)=>{
    createUserData(
        emailToId(form.elements['idCorreo'].value),
        form.elements['idCorreo'].value,
        form.elements['idNombreCompleto'].value,
        form.elements['idEmpresa'].value,
    ).then((res)=>{
        successLogin();
    }).catch((e)=> {
        alert("Ha ocurrido un error, intente nuevamente."+e)
    })
}
