<script>
    import { push } from 'svelte-spa-router';
    import { getProject } from '../url.js';
    import { isLogined, getToken } from '../storage.js';
    export let params = {};

    if(!isLogined()){
        push("/");
    }

    let url = getProject(params.uuid);
    let project = {};
    let isProjectLoaded = false;

    if(typeof url == "string"){
        fetch(url).then((resp) => resp.json()).then((data) => {
            Object.assign(project, data);
            delete project['date'];

            project['tags'] = project['tags'].join(", ");

            isProjectLoaded = true;
        })
    } else {
        push("/");
    }

    function projectSave(){
        fetch(url, {
            method: "POST",
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then((resp) => resp.json()).then((data) => {
            if(data.status == undefined){
                alert(data.message);
            } else {
                push(`/project/${params.uuid}`);
            }
        });
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">프로젝트 수정</h1>
    </div>
</section>

{#if isProjectLoaded == true}
<section class="section">
    <div class="container">
        <div class="box">
            <div class="field">
                <label class="label" for="title">제목</label>
                <div class="control">
                    <input id="title" class="input" type="text" bind:value="{project.title}">
                </div>
            </div>
            <div class="field">
                <label class="label" for="dt">날짜</label>
                <div class="control">
                    <input id="dt" class="input" type="date" bind:value="{project.dt}">
                </div>
            </div>
        </div>

        <div class="box">
            <div class="field">
                <label class="label" for="github">Github</label>
                <div class="control">
                    <input id="github" class="input" type="url" bind:value="{project.github}">
                </div>
            </div>
        </div>

        <div class="box">
            <div class="field">
                <label class="label" for="web">Web</label>
                <div class="control">
                    <input id="web" class="input" type="url" bind:value="{project.web}">
                </div>
            </div>
        </div>

        <div class="box">
            <div class="field">
                <label class="label" for="tags">태그</label>
                <div class="control">
                    <input id="tags" class="input" type="url" bind:value="{project.tags}">
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="box">
            <h2 class="title is-2">기획의도</h2>
            <textarea class="textarea is-medium" rows="12" bind:value={project.content.a}></textarea>    
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="box">
            <h2 class="title is-2">특징</h2>
            <textarea class="textarea is-medium" rows="12" bind:value={project.content.b}></textarea>    
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="box">
            <h2 class="title is-2">느낀점</h2>
            <textarea class="textarea is-medium" rows="12" bind:value={project.content.c}></textarea>    
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <button class="button is-primary is-large is-fullwidth" on:click={projectSave}>프로젝트 저장</button>
    </div>
</section>
{:else}
<section class="section">
    <div class="container">
        <h1 class="title is-1">잠시만요...</h1>
        <p>프로젝트 정보를 불러오고 있습니다...</p>
    </div>
</section>
{/if}

<section class="section">
    <div class="container">
        <div class="columns">
            <div class="column">
                <button class="button is-link is-large is-fullwidth" on:click={()=>{push("/")}}>
                    프로젝트 목록으로 이동
                </button>
            </div>
            <div class="column">
                <button class="button is-link is-light is-large is-fullwidth" on:click={()=>{push(`/project/${params.uuid}`)}}>
                    프로젝트로 돌아가기
                </button>
            </div>
        </div>
    </div>
</section>