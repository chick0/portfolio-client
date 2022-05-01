<script>
    import { push } from 'svelte-spa-router';

    function moveTo(uuid){
        push(`/project/${uuid}`);
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title is-1">chick_0</h1>
    </div>
</section>

<section class="section">
    <div class="container">
        <button on:click={() => {moveTo(`cfda4dd2-b2c3-4d77-81d7-65056e0d8080`)}}>move to project</button>
    </div>
</section>