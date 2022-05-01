const HOST = "https://mypt.ch1ck.xyz";

export function getProject(uuid) {
    if(uuid.length == 36){
        return `${HOST}/project/${uuid}`
    } else {
        return false;
    }
}

export function getProjects(page){
    if(page == undefined){
        page = 1;
    }

    return page;
}