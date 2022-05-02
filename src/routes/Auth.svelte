<script>
    import { getVerify } from '../url.js';
    import { setToken, isLogined, checkToken } from '../storage.js';
    import { tokenStatus } from '../store.js';
    import { push } from 'svelte-spa-router';

    let isLoginChecked = false;
    if(isLogined() === true){
        tokenStatus.set(null);
        tokenStatus.subscribe((v) => {
            if(v == null){
                // 인증 토큰 검증하기
                checkToken();
            } else if(v === true){
                // 인증 토큰이 만료되지 않음
                push("/");
            } else if(v === false){
                // 인증 토큰 만료됨
                isLoginChecked = true;
            }
        });
    } else {
        // 로그인 상태가 아님 검사 건너뛰기
        isLoginChecked = true;
    }

    function verifyCode(){
        const code = document.getElementById("code-input").value;
        document.getElementById("code-input").value = "";

        fetch(getVerify(), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code
            })
        }).then((resp) => resp.json()).then((data)=>{
            if(data.token == undefined){
                alert(data.message);
                document.getElementById("code-input").focus();
            } else {
                setToken(data.token);
                push("/");
            }
        });
    }
</script>

{#if isLoginChecked == true}
<section class="section">
    <div class="container">
        <h1 class="title is-1">인증 코드</h1>
        <p class="subtitle">발급된 인증 코드를 입력해주세요.</p>

        <div class="field">
            <label class="label" for="code-input">인증 코드</label>
            <div class="control">
                <input id="code-input" class="input is-danger" type="tel">
            </div>
        </div>
        <div class="field">
            <div class="control">
                <button class="button is-danger is-light is-large is-fullwidth" on:click={verifyCode}>다음</button>
            </div>
        </div>
    </div>
</section>
{:else}
<section class="section">
    <div class="container">
        <h1 class="title is-1">잠시만요...</h1>
        <p class="subtitle">인증 토큰 만료 여부를 확인하고 있습니다...</p>
    </div>
</section>
{/if}

<section class="section">
    <div class="container">
        <button class="button is-link is-large is-fullwidth" on:click={()=>{push("/")}}>프로젝트 목록으로 돌아가기</button>
    </div>
</section>
