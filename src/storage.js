import { getTokenVerify, getRenewToken } from './url.js';
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

    fetch(getTokenVerify(), {
        method: "GET",
        headers: {
            "Authorization": token,
        }
    }).then((resp) => resp.json()).then((data) => {
        // 토큰 검증 결과(상태)
        let status = data.status;
        // 검증 결과가 비어있다면
        if(status == undefined){
            // 인증 토큰 삭제하기
            clearToken();
            // 오류 메시지 표시하기
            alert(data.message);
            // 토큰 상태 사용 불가능함으로 설정
            tokenStatus.set(false);
        } else {
            // 토큰 상태 사용 가능함으로 설정
            // - api의 결과 값을 따르는데 api는 true또는 undefined를 반환함
            tokenStatus.set(data.status);
            // 토큰 갱신이 필요하다면
            if(data.renew_required === true){
                // 토큰 갱신하기
                renewToken();
            }
        }
    });
}

export function renewToken(){
    fetch(getRenewToken(), {
        headers: {
            'Authorization': getToken()
        }
    }).then((resp) => resp.json()).then((data) => {
        // API에서 새로운 토큰 가져오기
        let newToken = data.token;
        // 가져온 토큰이 비어있다면
        if(newToken == undefined){
            // 인증 토큰 삭제하기
            clearToken();
            // 오류 메시지 표시하기
            alert(data.message);
        } else {
            // 성공 메시지 표시하기
            alert("인증 토큰이 연장되었습니다.");
            // 연장된 인증 토큰 저장하기
            setToken(newToken);
        }
    });
}