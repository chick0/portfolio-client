import { getTokenVerify } from './url.js';
import { tokenStatus } from './store.js';

const TOKEN_KEY = "mypt_token";

export function setToken(token){
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(){
    return localStorage.getItem(TOKEN_KEY);
}

export function isLogined(){
    let token = getToken();
    if(token == null){
        return false;
    } else {
        return token.split(".").length == 3;
    }
}

export function checkToken(){
    let token = getToken();
    if(token == null){
        return false;
    }

    fetch(getTokenVerify(), {
        method: "GET",
        headers: {
            "x-auth": token,
        }
    }).then((resp) => resp.json()).then((data) => {
        tokenStatus.set(data.status);
    });
}