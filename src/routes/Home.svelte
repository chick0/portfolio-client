<script>
    import { push } from 'svelte-spa-router';
    import { getProjects } from '../url.js';
    export let params = {};

    function moveTo(uuid){
        push(`/project/${uuid}`);
    }

    let page = 1;
    let pageData = {};
    let projects = [];
    let projectsLoaded = false;

    if(Number(params.page) > 0 ){
        page = Number(params.page);
    }

    let url = getProjects(page);
    fetch(url).then((resp) => resp.json()).then((data) => {
        Object.assign(projects, data.projects);
        Object.assign(pageData, data.page);
        projectsLoaded = true;
    });
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">chick_0</h1>

        <div class="block">
            <a class="button is-dark is-medium" href="https://github.com/chick0" target="_blank">Github</a>
        </div>
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