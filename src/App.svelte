<script>
    import Router from "svelte-spa-router";
    import { location } from "svelte-spa-router";
    import routes from "./routes.js";
    import { config } from "./config.js";

    // 라우터 경로 업데이트 감지
    location.subscribe((path) => {
        // 경로가 프로젝트 경로라면
        if (path.startsWith("/project")) {
            // 프로젝트 컴퍼넌트가 프로젝트 제목으로 문서 제목 업데이트
        } else {
            // 아니면 이름으로 문서 제목 초기화
            document.title = config.name;
        }
    });
</script>

<Router routes="{routes}" />

<section class="footer">
    <div class="container">
        <div class="colums">
            <div class="column">&copy; {config.name}</div>
            <div class="column">
                <a href="{config.github}">Github</a>
            </div>
            <div class="column">
                <a href="mailto:{config.email}">Email</a>
            </div>
        </div>
    </div>
</section>
