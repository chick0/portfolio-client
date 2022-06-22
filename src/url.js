export const HOST = isProduction === true ? "https://mypt.ch1ck.xyz" : "http://localhost:19564";

// 프로젝트 정보 조회
export function getProject(uuid) {
    if(uuid.length == 36){
        return `${HOST}/v3/project/${uuid}`
    } else {
        return false;
    }
}

// 프로젝트 목록 조회
export function getProjects(page){
    if(page == undefined){ page = 1; }
    return `${HOST}/v3/projects?page=${page}`;
}

// 태그로 프로젝트 목록 조회
export function getProjectsWithTags(page, tags){
    if(page == undefined){ page = 1; }
    return `${HOST}/v3/projects/tags?page=${page}&tags=${tags.join(',')}`;
}

// 로그인 요청 처리
export function getLogin(){
    return `${HOST}/v3/auth/login`;
}

// 이메일 인증 코드 검증
export function getVerify(){
    return `${HOST}/v3/auth/verify`;
}

// 인증 토큰 검증
export function getCheckToken(){
    return `${HOST}/v3/auth/token`;
}

// 프로젝트 생성
export function createProject(){
    return `${HOST}/v3/project/create`;
}

// 전체 인증 세션
export function session(){
    return `${HOST}/v3/auth/session`;
}

// 로그아웃 / 인증 세션 만료
export function logout(){
    return `${HOST}/v3/auth/token`;
}
export function revokeSessionWithId(session_id){
    return `${HOST}/v3/auth/session/${session_id}`;
}

// 인증 토큰 갱신
export function getRenewToken(){
    return `${HOST}/v3/auth/token`;
}

// 파일 업로드
export function storageUpload(){
    return `${HOST}/v3/storage/upload`;
}

// 업로드된 파일 목록
export function storageList(){
    return `${HOST}/v3/storage/list`;
}

// 업로드된 파일 관리
export function storageManage(uuid){
    return `${HOST}/v3/storage/manage/${uuid}`;
}

// 파일 다운로드 링크
export function storageDownload(uuid){
    return `${HOST}/v3/storage/download/${uuid}`;
}