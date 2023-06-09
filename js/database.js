import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js'
import { getDatabase, set, ref, onValue, child, push, update, remove } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js'
import {loadCredentials} from './files.js'

let firebaseConfig = {}
let database ={}
let app = {}
let existDatabase = false;


const getDB = function (){
    return new Promise((resolve,reject)=>{
        if (existDatabase){
            resolve(database)
        } else{
            existDatabase =true;
            loadCredentials().then((res)=>{
                firebaseConfig =res;
                app = initializeApp(firebaseConfig);
                database = getDatabase(app);
                resolve(database);
            });
        }
    });
};

export function getUserData() {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            const starCountRef = ref(db, '/users');
            onValue(starCountRef, (snapshot) => {
                resolve(snapshot.val())
            }, {
                onlyOnce: false
            });
        }).catch((e)=> reject("error getDB: "+e))
    });
}



export function updateScore(userId, newScore, questions, answers) {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            const updates = {};
            updates['/users/' + userId+'/score'] = newScore;
            for (let i = 0; i < 6; i++) {
                updates['/users/' + userId+'/questionLevel'+(i+1)] = questions[i]?.id ?? "-"
                updates['/users/' + userId+'/answerLevel'+(i+1)] = answers[i] ?? "-"
            }
            update(ref(db), updates).then(()=>{
                resolve("Updated!! ")
            });
        }).catch((e)=> reject("error getDB: "+e))
    });
}

export function DeleteUser(userId) {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            set(ref(db, 'users/' + userId),  null ).then((res)=> resolve("DELETED!!"));
        }).catch((e)=> reject("error getDB: "+e))
    });
}


export function createUserData(userId, email, name, company) {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            set(ref(db, 'users/' + userId), {
                username: name,
                email: email,
                company: company,
                score : 0,
                questionLevel1 : '-',
                answerLevel1 : '-',
                questionLevel2 : '-',
                answerLevel2 : '-',
                questionLevel3 : '-',
                answerLevel3 : '-',
                questionLevel4 : '-',
                answerLevel4 : '-',
                questionLevel5 : '-',
                answerLevel5 : '-',
                questionLevel6 : '-',
                answerLevel6 : '-'
            }).then((res)=> resolve("writted"));
        }).catch((e)=> reject("error getDB: "+e))
    });
}
