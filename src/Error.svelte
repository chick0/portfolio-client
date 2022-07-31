<script>
    import { onMount } from "svelte";

    let report_email = REPORT_EMAIL;
    let status_url = STATUS_URL;

    let try_count_key = `retry:${location.hash}`;
    let try_count = Number(sessionStorage.getItem(try_count_key));

    let retry_button;

    function retry() {
        sessionStorage.setItem(try_count_key, (try_count + 1).toString());
        retry_button.classList.add("is-loading");

        setTimeout(() => {
            location.reload();
        }, 900);
    }

    onMount(() => {
        if (try_count < 3) {
            retry();
        } else {
            retry_button.classList.remove("is-loading");
        }
    });
</script>

<div class="notification is-danger is-light">
    <div class="content is-medium">
        <p>다시 시도하고 있습니다... <b>({try_count}/3)</b></p>
    </div>
    <button class="button is-primary is-loading" on:click="{retry}" bind:this="{retry_button}">다시 시도하기</button>
</div>

<div class="notification is-danger is-light">
    <div class="content is-medium">
        <p><b>서버 오류</b>로 인해 프로젝트 정보를 불러오는데 실패했습니다.</p>
        <p>아래의 버튼을 클릭해 서버의 상태를 확인 할 수 있습니다.</p>
    </div>
    <div class="buttons">
        <a class="button is-danger" href="{status_url}" target="_blank">서버 상태 확인하기</a>
        {#if try_count >= 3}
            <a class="button is-link" href="mailto:{report_email}?subject=[{location.host}] 서버 오류 보고">서버 오류 제보하기</a>
        {/if}
    </div>
</div>
