<script>
    import { HOST } from "../url.js";

    let version = APP_VERSION;

    let git_hash = GIT_HASH.slice(0, 7);
    let git_remote = GIT_REMOTE;

    let status = STATUS_URL;
</script>

<section class="section">
    <div class="container">
        <div class="box">
            <h5 class="title is-5">env</h5>
            <p><b>MODE</b>: {import.meta.env.MODE}</p>
            <p><b>SSR</b>: {import.meta.env.SSR}</p>
        </div>

        <div class="box">
            <h5 class="title is-5">client version</h5>
            <p>{version}</p>
        </div>

        <div class="box">
            <h5 class="title is-5">git hash</h5>
            <p>{git_hash}</p>
        </div>

        <div class="box">
            <h5 class="title is-5">git remote</h5>
            <p>{git_remote}</p>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="box">
            <h5 class="title is-5">api host</h5>
            <p>{HOST}</p>
        </div>

        <div class="box">
            <h5 class="title is-5">status page</h5>
            <p><a href="{status}" target="_blank">{status}</a></p>
        </div>
    </div>
</section>
