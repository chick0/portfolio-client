export const HOST = isProduction === true ? "https://mypt.ch1ck.xyz" : "http://localhost:19564";

// 프로젝트 정보 조회
export function getProject(uuid) {
    if(uuid.length == 36){
        return `${HOST}/v2/projects/${uuid}`
    } else {
        return false;
    }
}

// 프로젝트 목록 조회
export function getProjects(page){
    if(page == undefined){ page = 1; }
    return `${HOST}/v2/projects/list/page?page=${page}`;
}

// 로그인 요청 처리
export function getLogin(){
    return `${HOST}/v2/auth/login`;
}

// 이메일 인증 코드 검증
export function getVerify(){
    return `${HOST}/v2/auth/login/code`;
}

// 인증 토큰 검증
export function getCheckToken(){
    return `${HOST}/v2/auth/check/token`;
}

// 로그인 기록 조회
export function getHistory(){
    return `${HOST}/token/history`;
}

// 프로젝트 생성
export function createProject(){
    return `${HOST}/project`;
}

// 인증 코드 취소
export function revokeCode(code_id){
    return `${HOST}/token/code/${code_id}`;
}

// 인증 토큰 갱신
export function getRenewToken(){
    return `${HOST}/v2/auth/login/renew`;
}

// 태그로 프로젝트 목록 조회
export function getProjectsWithTags(page, tags){
    if(page == undefined){ page = 1; }
    return `${HOST}/v2/projects/list/tags?page=${page}&tags=${tags.join(',')}`;
}