<script>
    import { get } from "svelte/store";
    import { push } from 'svelte-spa-router';
    import { getProjects } from '../url.js';
    import { isLogined } from '../storage.js';
    import { pageStore } from '../store.js';

    function moveTo(uuid){
        pageStore.set(page);
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

    let page = get(pageStore);
    let pageData = {};
    let projects = [];
    let projectsLoaded = false;

    function fetchProject(){
        let url = getProjects(page);
        fetch(url).then((resp) => resp.json()).then((data) => {
            // 복사전 기존 데이터 삭제
            pageData = {};
            projects = [];
            // API에서 가져온 값 복사
            Object.assign(projects, data.projects);
            Object.assign(pageData, data.page);
            // 현재 페이지 정보 업데이트
            page = pageData.this;
            // 최대 페이지 보다 더 큰 페이지를 요청한 경우
            if(page > pageData.max){
                alert("해당 페이지는 존제하는 페이지가 아닙니다.");
                // 1번 페이지로 초기화
                page = 1;
                fetchProject();
            } else {
                // 프로젝트 로딩이 완료됨
                projectsLoaded  = true;
            }
        });
    }

    fetchProject();

    function updatePage(newPage){
        if(page != newPage){
            page = newPage;
            projectsLoaded = false;
            fetchProject();
        }
    }

    function getCenterPage(){
        // 페이지 버튼 목록
        // [ ] [ ] [ ] [ ] [ ]
        let pages = [];

        // 페이지가 2보다 작아서 중앙에 갈 수 없는 경우
        if(page > 2){
            for(let tmp = page - 2; tmp <= page + 2; tmp++){
                if(tmp <= pageData.max){
                    pages.push(tmp);
                }
            }
        } else {
            for(let tmp = page; tmp < page + 5; tmp++){
                if(tmp <= pageData.max){
                    pages.push(tmp);
                }
            }
        }

        // 페이지 버튼 개수가 5개 보다 작다면
        if(pages.length < 5){
            // 마지막 페이지 버튼 가져오기
            let lastPage = pages[pages.length - 1];
            // 마지막 페이지보다 4만큼 작은 수 부터 목록에 추가
            for(let tmp = lastPage - 4; tmp <= lastPage; tmp++){
                // 단 중복되어서는 안되고, 1보다 크고 최대 페이지 보다는 작아야 함
                if(pages.indexOf(tmp) == -1 && 1 <= tmp && tmp <= pageData.max){
                    pages.push(tmp);
                }
            }

            // 순서가 섞였으므로 정렬
            pages = pages.sort()
        }

        return pages;
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1" on:click={nameClicked}>chick_0</h1>
        <div class="block">
            <a class="button is-dark is-medium" href="https://github.com/chick0" target="_blank">Github</a>
            <a class="button is-link is-medium" href="mailto:chick_0@ch1ck.xyz" target="_blank">Email</a>
        </div>
    <!-- svelte-ignore missing-declaration -->
    {#if isProduction == false}
        <div class="notification is-danger is-light">
            해당 빌드는 테스트 모드 입니다.
        </div>
    {/if}
    {#if isLogined() == true}
        <div class="box">
            <button class="button is-primary is-light" on:click={()=>{push("/new-project")}}>새로운 프로젝트 등록</button>
            <button class="button is-info is-light" on:click={()=>{push("/auth/history")}}>로그인 기록 조회하기</button>
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
                        on:click|preventDefault={()=>{console.log(`tag:${tag}`)}}
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

{#if pageData.max != 1}
<section class="section">
    <div class="container">
        <nav class="pagination is-medium is-centered">
            <button class="pagination-previous" style="background-color:#FFF;" on:click={()=>{updatePage(page - 1)}}>&Lt;</button>
            <button class="pagination-next" style="background-color:#FFF;" on:click={()=>{updatePage(page + 1)}}>&Gt;</button>
            <ul class="pagination-list">
            {#each getCenterPage() as index}
                <li>
                    {#if index == page}
                    <button class="pagination-link is-current" on:click={() => {updatePage(index)}}>{index}</button>
                    {:else}
                    <button class="pagination-link" style="background-color:#FFF;" on:click={() => {updatePage(index)}}>{index}</button>
                    {/if}
                </li>
            {/each}
            </ul>
        </nav>
    </div>
</section>
{/if}
{/if}