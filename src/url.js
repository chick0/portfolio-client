const HOST = isProduction === true ? "https://mypt.ch1ck.xyz" : "http://localhost:5000";

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

export function getVerify(){
    return `${HOST}/auth/verify`;
}

export function getTokenVerify(){
    return `${HOST}/token/verify`;
}