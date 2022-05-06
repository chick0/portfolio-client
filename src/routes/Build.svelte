<script>
    import { HOST } from "../url.js";
    let host = location.host;

    // 선언되지 않은 변수들은 rollup의 replace플러그인으로 변경됨
</script>

<section class="section">
    <div class="container">
        <div class="box">
            <p>client host = <b>{host}</b></p>
            <p>api host = <b>{HOST}</b></p>
            <p>production mode = <b>isProduction</b></p>
        </div>

        <div class="box">
            <p>git repo url = <b>gitRepoURL</b></p>
            <p>last commit = <b>commitId</b></p>
        </div>
    </div>
</section>