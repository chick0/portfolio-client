<script>
    import { push } from 'svelte-spa-router';
    import { getProjects } from '../url.js';
    import { isLogined } from '../storage.js';

    function moveTo(uuid){
        push(`/project/${uuid}`);
    }

    let nameCounter = 1;
    function nameClicked(){
        if(nameCounter == 3){
            push("/auth");
        } else {
            nameCounter += 1;
        }
    }

    let page = 1;
    let pageData = {};
    let projects = [];
    let projectsLoaded = false;

    let url = getProjects(page);
    fetch(url).then((resp) => resp.json()).then((data) => {
        Object.assign(projects, data.projects);
        Object.assign(pageData, data.page);
        projectsLoaded = true;
    });
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1" on:click={nameClicked}>chick_0</h1>
        <div class="block">
            <a class="button is-dark is-medium" href="https://github.com/chick0" target="_blank">Github</a>
            <a class="button is-link is-medium" href="mailto:chick_0@ch1ck.xyz" target="_blank">Email</a>
        </div>
    {#if isLogined() == true}
        <div class="box">
            <button class="button is-primary is-light" on:click={()=>{push("/new-project")}}>새로운 프로젝트 등록</button>
            <button class="button is-info is-light">로그인 기록 조회하기</button>
        </div>
    {/if}
    </div>
</section>

{#if projectsLoaded == false}
<section class="section">
    <div class="container">
        <h2 class="title is-2">잠시만요...</h2>
        <p class="subtitle">프로젝트 목록을 불러오고 있습니다...</p>
    </div>
</section>
{:else}
<section class="section">
    <div class="container">
        <div class="content is-large">
        {#each projects as p }
            <div class="box" on:click={()=>{moveTo(p.uuid)}}>
                <h2 class="title is-4">{p.title}</h2>
                <p class="subtitle">{p.date}</p>
                <div class="block">
                {#each p.tags as tag}
                    <button class="button is-warning"
                        on:click|preventDefault={()=>{alert(`tag:${tag}`)}}
                    >
                        {tag}
                    </button>&nbsp;
                {/each}
                </div>
            </div>
        {/each}
        </div>
    </div>
</section>
{/if}