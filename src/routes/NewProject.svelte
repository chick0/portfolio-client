<script>
    import { push } from 'svelte-spa-router';
    import { createProject } from '../url.js';
    import { isLogined, getToken } from '../storage.js';

    if(!isLogined()){
        push("/");
    }

    let d = new Date();
    let year = d.getFullYear();

    let url = createProject();
    let project = {
        title: "[작성중] 제목 없는 프로젝트",
        date: `${year}-05-21`,
        tag: '작성중',
        web: 'https://ch1ck.xyz',
        github: 'https://github.com/',
        a: '기획의도 작성중',
        b: '특징 작성중',
        c: '느낀점 작성중',
    };

    function projectSave(){
        fetch(url, {
            method: "POST",
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then((resp) => resp.json()).then((data) => {
            if(data.uuid == undefined){
                alert(data.detail.alert);
            } else {
                push(`/project/${data.uuid}`);
            }
        });
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">새 프로젝트 등록</h1>
    </div>
</section>

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
                    <input id="dt" class="input" type="date" bind:value="{project.date}">
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
                    <input id="tags" class="input" type="url" bind:value="{project.tag}">
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="box">
            <h2 class="title is-2">기획의도</h2>
            <textarea class="textarea is-medium" rows="12" bind:value={project.a}></textarea>    
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="box">
            <h2 class="title is-2">특징</h2>
            <textarea class="textarea is-medium" rows="12" bind:value={project.b}></textarea>    
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="box">
            <h2 class="title is-2">느낀점</h2>
            <textarea class="textarea is-medium" rows="12" bind:value={project.c}></textarea>    
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <button class="button is-primary is-large is-fullwidth" on:click={projectSave}>프로젝트 저장</button>
    </div>
</section>

<section class="section">
    <div class="container">
        <button class="button is-link is-large is-fullwidth" on:click={()=>{push("/")}}>
            프로젝트 목록으로 이동
        </button>
    </div>
</section>