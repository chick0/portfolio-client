<script>
    import { push } from 'svelte-spa-router';
    import { session, revokeSessionWithId } from '../url.js';
    import { isLogined, getToken, clearToken } from '../storage.js';

    let sessionList = [];
    let isLoaded = false;

    if(!isLogined()){
        push("/");
    } else {
        fetch(session(), {
            method: "GET",
            headers: {
                "Authorization": getToken(),
            }
        }).then((resp) => resp.json()).then((data) => {
            if(data.sessionList != undefined){
                Object.assign(sessionList, data.sessionList);
                isLoaded = true;
            } else {
                alert("오류가 발생했습니다.");
                push("/auth");
            }
        });
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">인증 세션</h1>

        <div class="box">
            <h5 class="title is-5">위험 메뉴</h5>
            <div class="buttons">
                <button
                    class="button is-danger"
                    on:click={()=>{
                        if(confirm("전체 세션을 삭제하시겠습니까?")){
                            fetch(session(), {
                                method: "DELETE",
                                headers: {
                                    'Authorization': getToken()
                                }
                            }).then((resp) => resp.json()).then((data) => {
                                if(data.status == true){
                                    alert("전체 세션에 삭제되었습니다.");
                                    clearToken();
                                    push("/");
                                } else {
                                    alert(data.detail.alert);
                                }
                            });
                        }
                    }}
                >
                    전체 세션 삭제하기
                </button>
            </div>
        </div>
    </div>
</section>

{#if isLoaded == true}
<section class="section">
    <div class="container">
        {#each sessionList as ctx}
        <div class="box" on:click={()=>{
            if(confirm("해당 세션을 취소하시겠습니까?")){
                fetch(revokeSessionWithId(ctx.id), {
                    method: "DELETE",
                    headers: {
                        'Authorization': getToken()
                    }
                }).then((resp) => resp.json()).then((data) => {
                    if(data.status == true){
                        alert("해당 세션이 취소되었습니다.");

                        const index = sessionList.findIndex((e) => e.id == ctx.id);                        
                        sessionList[index].revoked = true;
                    } else {
                        alert(data.detail.alert);
                    }
                });
            }
        }}>
            <div class="content is-medium">
                <p>생성 날짜 : {ctx.creation_date.pretty}</p>
                <p>요청 IP : {ctx.ip}</p>
            {#if ctx.revoked == true}
                <p><b class="has-text-danger">* 만료된 세션</b></p>
            {:else}
                <p><b class="has-text-success">* 만료되지 않은 세션</b></p>
            {/if}
            {#if ctx.same == true}
                <blockquote>현재 사용중인 세션</blockquote>
            {/if}
            </div>
        </div>
        {/each}
    </div>
</section>
{:else}
<section class="section">
    <div class="container">
        <h2 class="title is-2">잠시만요...</h2>
        <p class="subtitle">인증 세션 목록을 불러오고 있습니다...</p>
    </div>
</section>
{/if}

<!-- button for desktop or tablet -->
<button
    class="button is-primary is-medium is-fullwidth container is-hidden-touch"
    style="position: -webkit-sticky; position: sticky; bottom: 10px;"
    on:click={()=>{push("/")}}
>
    프로젝트 목록으로 이동
</button>

<!-- button for mobile -->
<button
    class="button is-primary is-medium is-fullwidth container is-hidden-desktop"
    style="position: -webkit-sticky; position: sticky; bottom: 10px; max-width: 90%;"
    on:click={()=>{push("/")}}
>
    프로젝트 목록으로 이동
</button>

<section class="section"></section>