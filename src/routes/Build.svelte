<script>
    import { HOST } from "../url.js";
    let host = location.host;
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