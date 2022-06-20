<script>
    import { HOST } from "../url.js";

    let remote = new URL("gitRepoURL").pathname.slice(1);
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">빌드 정보</h1>
    <!-- svelte-ignore missing-declaration -->
    {#if isProduction == false}
        <div class="notification is-danger is-light">
            해당 빌드는 테스트 모드 입니다.
        </div>
    {:else}
        <div class="notification is-primary is-light">
            프로덕션 모드 입니다.
        </div>
    {/if}

        <div class="box">
            <h4 class="title is-4">MyPT API</h4>
            <div class="content is-medium">
                <p>{HOST}</p>
            </div>
        </div>

        <div class="box">
            <h4 class="title is-4">client version</h4>
            <div class="content is-medium">
                <a href="gitRepoURL" target="_blank">
                    {remote} - commitId
                </a>
            </div>
        </div>
    </div>
</section>