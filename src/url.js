export const HOST = isProduction === true ? "https://mypt.ch1ck.xyz" : "http://localhost:5000";

export function getProject(uuid) {
    if(uuid.length == 36){
        return `${HOST}/project/${uuid}`
    } else {
        return false;
    }
}

export function getProjects(page){
    if(page == undefined){ page = 1; }
    return `${HOST}/projects?page=${page}`;
}

export function getLogin(){
    return `${HOST}/auth`;
}

export function getVerify(){
    return `${HOST}/auth/verify`;
}

export function getTokenVerify(){
    return `${HOST}/token/verify`;
}

export function getHistory(){
    return `${HOST}/token/history`;
}

export function createProject(){
    return `${HOST}/project`;
}

export function revokeCode(code_id){
    return `${HOST}/token/code/${code_id}`;
}

export function getRenewToken(){
    return `${HOST}/token/renew`;
}

export function getProjectsWithTag(page, tag){
    if(page == undefined){ page = 1; }
    return `${HOST}/tag?page=${page}&tag=${tag}`;
}