<script>
    import { get } from "svelte/store";
    import { push } from 'svelte-spa-router';
    import { getProjects, getProjectsWithTags } from '../url.js';
    import { isLogined } from '../storage.js';
    import { pageStore, scrollStore, tagStore } from '../store.js';
    import { config } from "../config.js";

    // 프로젝트 화면으로 이동하는 것 방지
    let pushLock = false;
    // 태그 조회에서 사용할 변수
    let tagFilters = [];
    // 태그 없이 조회 할 때 페이지 값
    let defaultPage = undefined;

    // 태그 검색 사용중인지 확인하는 함수
    function isTagSearch(){
        return tagFilters.length != 0;
    }

    function getURL(){
        if(isTagSearch()){
            return getProjectsWithTags(page, tagFilters);
        } else {
            return getProjects(page);
        }
    }

    function projectMove(uuid){
        // 이동 잠금이 활성화 상태면 이벤트 무시하기
        if(pushLock === false){
            if(isTagSearch() == false){
                // 페이지 정보 백업하기
                pageStore.set(page);
                // 스크롤 정보 백업하기
                scrollStore.set(window.scrollY);
            } else {
                // 페이지 정보 백업하기
                pageStore.set(defaultPage);
                // 스크롤 정보는 이미 백업되었거나 백업되지 않음
            }

            // 프로젝트 페이지로 이동
            push(`/project/${uuid}`);
        }
    }

    function showTag(tag){
        // 이동 잠금 활성화
        pushLock = true;

        if(tagFilters.length < 5){
            if(tagFilters.indexOf(tag) == -1){
                tagFilters.push(tag);
                tagFilters = tagFilters;
            } else {
                return;
            }
        } else {
            alert("최대 5개까지 선택가능합니다.");
        }

        if(tagFilters.length === 1){
            // 태그 없는 상태의 페이지 정보를 다른 변수에 저장
            defaultPage = page;
            // 페이지 정보 초기화
            page = 1;
            // 스크롤 정보 백업
            scrollStore.set(window.scrollY);
        }

        // 스크롤 상단으로 이동하기
        document.getElementById("cursor-postion")?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
 
        // 프로젝트 목록 업데이트
        fetchProject();
    }

    function clearTag(tag){
        // 삭제해야하는 태그를 제외한 배열로 덮어쓰기
        tagFilters = tagFilters.filter((x) => {
            return x != tag;
        })

        if(!isTagSearch()){
            // 페이지 정보 불러오기
            page = defaultPage;

            // 스크롤 복구하도록 값 변경
            isFirstLoad = true;
        }

        // 프로젝트 목록 업데이트
        fetchProject();
    }

    // 이름 클릭 횟수 저장소
    let nameCounter = 1;
    function nameClicked(){
        if(nameCounter == 3){
            // 없으면 이동전 클릭했을때 여러번 반응함
            nameCounter += 1;
            push("/auth");
        } else {
            nameCounter += 1;
        }
    }

    // 저장소에서 페이지 정보 가져오기
    let page = get(pageStore);
    // 페이지 정보를 저장할 변수
    let pageData = {};
    // 프로젝트 목록을 저장할 변수
    let projects = [];
    // 프로젝트를 불러오고 있는지 체크할때 사용할 변수
    let projectsLoaded = false;

    function fetchProject(){
        // API 요청을 보낼 URL 가져오기
        let url = getURL();

        fetch(url).then((resp) => resp.json()).then((data) => {
            // 복사전 기존 데이터 삭제
            pageData = {};
            projects = [];
            // API에서 가져온 값 복사
            Object.assign(projects, data.projectList);
            Object.assign(pageData, data.page);
            // 스크롤 복구가 필요하면 복구하기
            if(isFirstLoad === true){
                // 스크롤 복구가 필요없다고 상태 변경
                isFirstLoad = false;
                // 랜더링이후 스크롤 복구하기
                setTimeout(() => {
                    window.scrollTo(0, get(scrollStore));
                    scrollStore.set(0);
                }, 40);                
            }
            // 현재 페이지 정보 업데이트
            page = pageData.this;
            // 최대 페이지 보다 더 큰 페이지를 요청한 경우
            if(page > pageData.max){
                if(isTagSearch()){
                    // 태그 필터 초기화
                    tagFilters = [];
                    alert("검색된 프로젝트가 없습니다.");
                } else {
                    alert("해당 페이지는 존제하는 페이지가 아닙니다.");
                }

                // 1번 페이지로 초기화
                page = 1;
                // 프로젝트 목록 업데이트
                fetchProject();
            } else {
                // 프로젝트 로딩이 완료됨
                projectsLoaded  = true;

                // 
                if(pushLock === true){
                    pushLock = false;
                }
            }
        });
    }

    // 프로젝트 목록 불러오기
    let isFirstLoad = true;

    if(get(tagStore) !== null){
        isFirstLoad = false;
        projectsLoaded = true;

        let scroll = get(scrollStore);
        const unsubscribe = scrollStore.subscribe((v) => {
            if(v == 0){
                scrollStore.set(scroll);
                unsubscribe();
            }
        });

        setTimeout(() => {
            showTag(get(tagStore));
        }, 50);
    } else {
        fetchProject();
    }

    function updatePage(newPage){
        // 기존 페이지와 새로운 페이지가 다르다면
        if(page != newPage){
            // 페이지 정보 업데이트
            page = newPage;
            // 프로젝트 로딩중인 상태로 변경
            projectsLoaded = false;

            // 프로젝트 목록 업데이트
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
            pages = pages.sort();
        }

        return pages;
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1" on:click={nameClicked}>{config.name}</h1>
        <p class="subtitle">제 프로젝트를 소개합니다.</p>
        <div class="buttons">
            <a class="button is-dark is-medium" href="{config.github}" target="_blank">Github</a>
            <a class="button is-link is-medium" href="mailto:{config.email}" target="_blank">Email</a>
        </div>
    <!-- svelte-ignore missing-declaration -->
    {#if isProduction == false}
        <div class="notification is-danger is-light">
            해당 빌드는 테스트 모드 입니다.
        </div>
    {/if}
    {#if isLogined() == true}
        <div class="box buttons">
            <button class="button is-primary is-light" on:click={()=>{push("/new-project")}}>새로운 프로젝트</button>
            <button class="button is-info is-light" on:click={()=>{push("/auth/history")}}>로그인 기록</button>
            <button class="button is-light" on:click={()=>{push("/auth/logout")}}>로그아웃</button>
        </div>
    {/if}
    </div>
</section>

<div id="cursor-postion"></div>

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
        {#if tagFilters.length > 0}
        <div class="block tags">
            {#each tagFilters as tag}
            <span class="tag is-danger is-large">
                #{tag}
                <button class="delete" on:click={() => {clearTag(tag)}}></button>
            </span>
            {/each}
        </div>
        {/if}

        <div class="content is-large">
        {#each projects as p }
            <div class="box" on:click={()=>{projectMove(p.uuid)}}>
                <h2 class="title is-4">{p.title}</h2>
                <p class="subtitle">{p.date}</p>
                <div class="block buttons">
                {#each p.tags as tag}
                    <button class="button is-warning"
                        on:click|preventDefault={()=>{showTag(tag)}}
                    >
                        #{tag}
                    </button>
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