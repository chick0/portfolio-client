<script>
    import { push } from 'svelte-spa-router';
    import { getHistory, revokeSessionWithId } from '../url.js';
    import { getToken } from '../storage.js';

    let history = [];
    let isHistoryLoaded = false;

    function fetchHistory(){
        fetch(getHistory(), {
            method: "GET",
            headers: {
                "Authorization": getToken(),
            }
        }).then((resp) => resp.json()).then((data) => {
            if(data.historyList != undefined){
                Object.assign(history, data.historyList);
                isHistoryLoaded = true;
            } else {
                alert("오류가 발생했습니다.");
                push("/auth");
            }
        });
    }

    fetchHistory();

    function askRevokeSession(session_id){
        if(confirm("해당 세션을 취소하시겠습니까?")){
            fetch(revokeSessionWithId(session_id), {
                method: "DELETE",
                headers: {
                    'Authorization': getToken()
                }
            }).then((resp) => resp.json()).then((data) => {
                if(data.status == true){
                    alert("해당 세션이 취소되었습니다.");
                    isHistoryLoaded = false;
                    fetchHistory();
                } else {
                    alert(data.detail.alert);
                }
            })
        }
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">로그인 기록</h1>
    </div>
</section>

{#if isHistoryLoaded == true}
<section class="section">
    <div class="container">
        {#each history as ctx}
        <div class="box" on:click={()=>{askRevokeSession(ctx.id)}}>
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
        <p class="subtitle">로그인 기록을 불러오고 있습니다...</p>
    </div>
</section>
{/if}

<!-- *sticky* -->
<button
    class="button is-primary is-medium is-fullwidth container"
    style="position: -webkit-sticky; position: sticky; bottom: 10px;"
    on:click={()=>{push("/")}}
>
    프로젝트 목록으로 이동
</button>

<section class="section"></section>