<script>
    import { push } from 'svelte-spa-router';
    import { Renderer, setOptions, parse } from "marked";
    import { getProject } from '../url.js';
    import { isLogined, getToken } from '../storage.js';
    export let params = {};

    let projectLoaded = false;
    let url = getProject(params.uuid);

    const renderer = new Renderer();
    let project = {};

    if(typeof url == "string"){
        renderer.link = (href, title, text) => {
            return `<a target="_blank" rel="noreferrer" href="${href}">${text}</a>`;
        };

        setOptions({
            gfm: true,
            renderer: renderer,
        });

        fetch(url).then((resp) => resp.json()).then((data) => {
            Object.assign(project, data);
            projectLoaded = true;
        });
    } else {
        // 올바른 프로젝트 ID가 아님
        push("/");
    }

    function projectDelete(){
        if(confirm("해당 프로젝트를 삭제하시겠습니까? (1/2)")){
            if(confirm("해당 프로젝트를 정말로 삭제하시겠습니까? (2/2)")){
                fetch(url, {
                    method: "DELETE",
                    headers: {
                        'x-auth': getToken()
                    }
                }).then((resp) => resp.json()).then((data) => {
                    alert(data.message);
                    if(data.status == true){
                        push("/");
                    }

                    projectLoaded = true;
                });

                projectLoaded = false;
                return;
            }
        }

        alert("취소되었습니다.");
    }
</script>

{#if projectLoaded == true}
<section class="section">
    <div class="container">
        <h1 class="title is-1">{project.title}</h1>
        <p class="subtitle">{project.date}</p>

        <div class="block">
        {#if project.github.length != 0}
            <a class="button is-dark" href="{project.github}" target="_blank">Github</a>
        {/if}
        {#if project.web.length != 0}
            <a class="button is-link" href="{project.web}" target="_blank">Web</a>
        {/if}
        </div>

        {#if isLogined() == true}
        <div class="box">
            <button class="button is-warning" on:click={()=>{push(`/project/${params.uuid}/edit`)}}>프로젝트 수정</button>
            <button class="button is-danger" on:click={projectDelete}>프로젝트 삭제</button>
        </div>
        {/if}
    </div>
</section>

<section class="section">
    <div class="container">
        <h2 class="title is-2">기획의도</h2>
        <div class="content is-medium">{@html parse(project.content.a)}</div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2 class="title is-2">특징</h2>
        <div class="content is-medium">{@html parse(project.content.b)}</div>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2 class="title is-2">느낀점</h2>
        <div class="content is-medium">{@html parse(project.content.c)}</div>
    </div>
</section>

<section class="section">
    <div class="container">
        <button class="button is-link is-large is-fullwidth" on:click={()=>{push("/")}}>
            프로젝트 목록으로 이동
        </button>
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