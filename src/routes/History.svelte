<script>
    import { push } from 'svelte-spa-router';
    import { getHistory } from '../url.js';
    import { getToken } from '../storage.js';

    function parseTimeStamp(timestamp){
        let dateObj = new Date(timestamp * 1000);

        let date = [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()];
        date.forEach((v, i) => { if(v < 10){ date[i] = `0${v}`; }});

        let time = [dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()];
        time.forEach((v, i) => { if(v < 10){ time[i] = `0${v}`; }});

        return date.join("-") + " " + time.join(":");
    }

    let history = [];
    let isHistoryLoaded = false;

    fetch(getHistory(), {
        method: "GET",
        headers: {
            "x-auth": getToken(),
        }
    }).then((resp) => resp.json()).then((data) => {
        if(data.history != undefined){
            Object.assign(history, data.history);
            isHistoryLoaded = true;
        } else {
            alert(data.message);
            push("/");
        }
    });
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">로그인 기록</h1>
        <p class="subtitle">가장 최신 기록부터 총 60개의 기록만 조회 할 수 있습니다.</p>
    </div>
</section>

{#if isHistoryLoaded == true}
<section class="section">
    <div class="container">
        {#each history as code}
        <div class="box">
            <div class="content is-medium">
                <p>요청 IP : {code.ip}</p>
                {#if code.code == "-"}
                <p>인증 코드 : <b>토큰 연장 요청</b></p>
                {:else}
                <p>인증 코드 : {code.code}</p>
                {/if}
                <p>생성 날짜 : {parseTimeStamp(code.creation_date)}</p>
                <p>만료 날짜 : {parseTimeStamp(code.dead_date)}</p>
                {#if code.used == true}
                <p><b>해당 코드는 사용된 코드입니다.</b></p>
                {:else}
                <p>해당 코드는 사용되지 않은 코드입니다.</p>
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
<section class="section">
    <div class="container">
        <button class="button is-link is-large is-fullwidth" on:click={()=>{push("/")}}>
            프로젝트 목록으로 이동
        </button>
    </div>
</section>