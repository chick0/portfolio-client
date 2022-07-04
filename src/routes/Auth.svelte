<script>
    import { getLogin, getVerify } from "../url.js";
    import { setToken, isLogined, checkToken } from "../storage.js";
    import { tokenStatus } from "../store.js";
    import { push } from "svelte-spa-router";

    // 세션 스토리지에 현재 상태를 저장할 때 사용할 키
    const AUTH_STATUS = "mypt_auth_restore_required";
    const AUTH_STEP = "mypt_auth_step";
    const AUTH_USER = "mypt_auth_user_id";
    const AUTH_REQUEST = "mypt_auth_request_id";

    // 로그인 화면 표시 여부
    let isLoginChecked = false;

    // 만약 로그인해서 토큰이 있다면 토큰 검증하기
    if (isLogined() === true) {
        tokenStatus.set("checkRequired");
        tokenStatus.subscribe((v) => {
            if (v == "checkRequired") {
                // 인증 토큰 검증하기
                checkToken();
            } else if (v === true) {
                // 인증 토큰이 만료되지 않음
                push("/");
            } else if (v === false) {
                // 인증 토큰 만료됨
                isLoginChecked = true;
            }
        });
    } else {
        // 로그인 상태가 아님 로그인 화면 표시하기
        isLoginChecked = true;
    }

    // login step
    let step = 1;

    // step 1
    let email = "";
    let password = "";

    // step 2
    let user_id = 0;
    let request_id = 0;
    let code = "";

    // 세션 스토리지에 저장된 상태를 복구해야하는지 검사
    if (sessionStorage.getItem(AUTH_STATUS) === "true") {
        step = Number(sessionStorage.getItem(AUTH_STEP));
        user_id = Number(sessionStorage.getItem(AUTH_USER));
        request_id = Number(sessionStorage.getItem(AUTH_REQUEST));
    }

    function goNext(keyBoardDown) {
        // 엔터 키를 눌렀다면
        if (keyBoardDown.charCode === 13) {
            if (step == 1) {
                doLogin();
            } else if (step == 2) {
                verifyCode();
            }
        }
    }

    function doLogin() {
        if (email.length == 0 || password.length == 0) {
            alert("이메일과 비밀번호를 입력해주세요.");
            // 이메일과 비번 입력창에 빨간 테두리 생성
            document.getElementById("email-input").classList.add("is-danger");
            document.getElementById("password-input").classList.add("is-danger");
        } else {
            // 로그인 요청 처리중 상태로 변경
            isLoginChecked = false;

            fetch(getLogin(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })
                .then((resp) => resp.json())
                .then((data) => {
                    // 로그인 요청 처리 완료 상태로 변경
                    isLoginChecked = true;
                    // 입력한 비밀번호 초기화
                    password = "";

                    // 로그인에 성공했다면
                    if (data.user_id != undefined) {
                        // 다음단계로 이동하기
                        step = 2;

                        user_id = data.user_id;
                        request_id = data.request_id;

                        // 세션 스토리지를 활용해 현재 상태 저장
                        sessionStorage.setItem(AUTH_STATUS, "true");
                        sessionStorage.setItem(AUTH_STEP, '2');
                        sessionStorage.setItem(AUTH_USER, user_id.toString());
                        sessionStorage.setItem(AUTH_REQUEST, request_id.toString());
                    } else {
                        alert(data.detail.alert);
                    }
                });
        }
    }

    function verifyCode() {
        fetch(getVerify(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id,
                request_id,
                token: code,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                // 발급된 토큰이 없다면
                if (data.token == undefined) {
                    alert(data.detail.alert);
                    // 입력한 코드 초기화하고
                    code = "";
                    // 입력창으로 커서 이동
                    document.getElementById("code-input").focus();
                } else {
                    // 토큰이 있다면, 토큰 설정하고
                    setToken(data.token);
                    // 세션 스토리지에 저장된 상태 초기화
                    sessionStorage.clear();
                    // 메인화면으로 이동하기
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
                <p
                    class="subtitle has-text-link is-clickable"
                    on:click="{() => {
                        push('/');
                    }}">
                    프로젝트 목록으로 돌아가기
                </p>

                <div class="field">
                    <label class="label" for="email-input">이메일</label>
                    <div class="control">
                        <input id="email-input" class="input" type="email" bind:value="{email}" />
                    </div>
                </div>
                <div class="field">
                    <label class="label" for="password-input">비밀번호</label>
                    <div class="control">
                        <input
                            id="password-input"
                            class="input"
                            type="password"
                            bind:value="{password}"
                            on:keypress="{goNext}" />
                    </div>
                </div>

                <div class="field">
                    <div class="control">
                        <button class="button is-primary is-light is-large is-fullwidth" on:click="{doLogin}"
                            >다음</button>
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
                        <input id="code-input" class="input" type="tel" bind:value="{code}" on:keypress="{goNext}" />
                    </div>
                </div>
                <div class="field">
                    <div class="control">
                        <button class="button is-danger is-light is-large is-fullwidth" on:click="{verifyCode}"
                            >다음</button>
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
