<script>
    import { getLogin, getVerify } from '../url.js';
    import { setToken, isLogined, checkToken } from '../storage.js';
    import { tokenStatus } from '../store.js';
    import { push } from 'svelte-spa-router';

    // 로그인 화면 표시 여부
    let isLoginChecked = false;

    // 만약 로그인해서 토큰이 있다면 토큰 검증하기
    if(isLogined() === true){
        tokenStatus.set("checkRequired");
        tokenStatus.subscribe((v) => {
            if(v == "checkRequired"){
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
        // 로그인 상태가 아님 로그인 화면 표시하기
        isLoginChecked = true;
    }

    // 1: email & password
    // 2: email & code
    let step = 1;

    // step 1
    let email = "";
    let password = "";

    // step 2
    let code = "";

    function goNext(keyBoardDown){
        if(keyBoardDown.charCode === 13){
            if(step == 1){
            doLogin();
            } else if(step == 2) {
                verifyCode();
            }
        }
    }

    function doLogin(){
        if(email.length == 0 || password.length == 0){
            alert("이메일과 비밀번호를 입력해주세요.");
            document.getElementById("email-input").classList.add("is-danger");
            document.getElementById("password-input").classList.add("is-danger");
        } else {
            isLoginChecked = false;
            fetch(getLogin(), {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }).then((resp) => resp.json()).then((data)=>{
                alert(data.message);
                isLoginChecked = true;

                if(data.status === true){
                    step = 2;
                    password = "";
                } else {
                    password = "";
                }
            });
        }
    }

    function verifyCode(){
        fetch(getVerify(), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                code
            })
        }).then((resp) => resp.json()).then((data)=>{
            if(data.token == undefined){
                alert(data.message);
                code = "";
                document.getElementById("code-input").focus();
            } else {
                setToken(data.token);
                push("/");
            }
        });
    }
</script>

{#if isLoginChecked == true}
{#if step == 1}
<section class="section">
    <div class="container">
        <h1 class="title is-1">로그인</h1>

        <div class="field">
            <label class="label" for="email-input">이메일</label>
            <div class="control">
                <input id="email-input" class="input" type="email" bind:value={email}>
            </div>
        </div>
        <div class="field">
            <label class="label" for="password-input">비밀번호</label>
            <div class="control">
                <input id="password-input" class="input" type="password" bind:value={password} on:keypress={goNext}>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <button class="button is-primary is-light is-large is-fullwidth" on:click={doLogin}>다음</button>
            </div>
        </div>
    </div>
</section>
{:else}
<section class="section">
    <div class="container">
        <h1 class="title is-1">인증 코드</h1>
        <p class="subtitle">발급된 인증 코드를 입력해주세요.</p>

        <div class="field">
            <label class="label" for="code-input">인증 코드</label>
            <div class="control">
                <input id="code-input" class="input" type="tel" bind:value={code} on:keypress={goNext}>
            </div>
        </div>
        <div class="field">
            <div class="control">
                <button class="button is-danger is-light is-large is-fullwidth" on:click={verifyCode}>다음</button>
            </div>
        </div>
    </div>
</section>
{/if}
{:else}
<section class="section">
    <div class="container">
        <h1 class="title is-1">잠시만요...</h1>
        <p class="subtitle">로그인 요청을 처리하고 있습니다...</p>
    </div>
</section>
{/if}

<section class="section">
    <div class="container">
        <button class="button is-link is-large is-fullwidth" on:click={()=>{push("/")}}>프로젝트 목록으로 돌아가기</button>
    </div>
</section>
