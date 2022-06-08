<script>
    import { logout } from "../url.js";
    import { clearToken, getToken } from "../storage.js";
    import { push } from "svelte-spa-router";

    fetch(logout(), {
        method: "DELETE",
        headers: {
            'Authorization': getToken()
        }
    }).then((resp) => resp.json()).then((data) => {
        if(data.status == true){
            alert("로그아웃 되었습니다.");
        } else {
            alert("오류가 발생했습니다.");
        }

        clearToken();
        push("/");
    })
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">잠시만요...</h1>
        <p>로그아웃 요청을 처리하고 있습니다...</p>
    </div>
</section>