import { getCheckToken, getRenewToken } from './url.js';
import { tokenStatus } from './store.js';

// 인증 토큰이 저장될 키 값
const TOKEN_KEY = "mypt_token";

export function clearToken(){
    // 로컬스토리지에 저장된 인증 토큰 삭제
    localStorage.removeItem(TOKEN_KEY);
}

export function setToken(token){
    // 로컬스토리지에 인증 토큰 저장
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(){
    // 로컬스토리지에서 인증 토큰 불러오기
    return "Bearer " + localStorage.getItem(TOKEN_KEY);
}

export function isLogined(){
    // 인증 토큰 불러오기
    let token = getToken();
    // 인증 토큰이 없다면
    if(token == null){
        // 로그인 상태가 아님
        return false;
    } else {
        // 임시 체크
        // TODO:페이로드 파싱 & 만료 시간 검증
        return token.split(".").length == 3;
    }
}

export function checkToken(){
    // 인증 토큰 불러오기
    let token = getToken();
    // 토큰이 없다면
    if(token == null){
        // 토큰 검증 중단 및 실패
        return false;
    }

    fetch(getCheckToken(), {
        method: "GET",
        headers: {
            "Authorization": token,
        }
    }).then((resp) => resp.json()).then((data) => {
        if(data.status === true){
            tokenStatus.set(true);

            // 토큰 갱신이 필요하다면
            if(data.ttl <= 1800){
                // 토큰 갱신하기
                renewToken();
            }
        } else {
            alert("만료된 세션입니다.");
            clearToken();
            // 토큰 상태 = 사용 불가
            tokenStatus.set(false);            
        }
    });
}

export function renewToken(){
    fetch(getRenewToken(), {
        headers: {
            'Authorization': getToken()
        }
    }).then((resp) => resp.json()).then((data) => {
        // 생성된 토큰이 없다면 = 인증 세션 만료임
        if(data.token == undefined){
            // 인증 토큰 삭제하기
            alert(data.detail.alert);
            clearToken();
        } else {
            // 연장된 토큰 저장하기
            setToken(data.token);
        }
    });
}