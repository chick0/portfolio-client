<script>
    import { push } from "svelte-spa-router";
    import { HOST } from "../url.js";

    // eslint-disable-next-line no-undef
    let env = isProduction;

    let short = "commitId".slice(0, 7);

    let isGithub = "gitRepoURL".startsWith("https://github.com");
    let remote = new URL("gitRepoURL").pathname.slice(1);
    if (remote.endsWith(".git")) remote = remote.slice(0, remote.length - 4);
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">빌드 정보</h1>
        <p
            class="subtitle has-text-link is-clickable"
            on:click="{() => {
                push('/');
            }}">
            프로젝트 목록으로 돌아가기
        </p>
        {#if env == false}
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
                    {remote} - {short}
                </a>
            </div>
            <button
                class="button is-primary"
                on:click="{() => {
                    if (!isGithub) {
                        alert('깃헙에 저장된 프로젝트가 아닙니다.');
                    } else {
                        fetch(`https://api.github.com/repos/${remote}/commits`)
                            .then((resp) => resp.json())
                            .then((json) => {
                                let top = json[0];
                                if (top.sha == 'commitId') {
                                    alert('최신 버전 입니다.');
                                } else {
                                    alert('최신 버전이 아닙니다.');
                                }
                            });
                    }
                }}">
                check from remote
            </button>
        </div>
    </div>
</section>
