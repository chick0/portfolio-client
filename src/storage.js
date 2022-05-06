import { getTokenVerify, getRenewToken } from './url.js';
import { tokenStatus } from './store.js';

const TOKEN_KEY = "mypt_token";

export function clearToken(){
    localStorage.removeItem(TOKEN_KEY);
}

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
        let status = data.status;
        if(status == undefined){
            clearToken();
            alert(data.message);
            tokenStatus.set(false);
        } else {
            tokenStatus.set(data.status);
            if(data.renew_required === true){
                renewToken();
            }
        }
    });
}

export function renewToken(){
    fetch(getRenewToken(), {
        headers: {
            'x-auth': getToken()
        }
    }).then((resp) => resp.json()).then((data) => {
        let newToken = data.token;
        if(newToken == undefined){
            alert(data.message);
        } else {
            alert("인증 토큰이 연장되었습니다.");
            setToken(newToken);
        }
    });
}