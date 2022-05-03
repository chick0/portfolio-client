<script>
    import Router from 'svelte-spa-router';
    import { location } from 'svelte-spa-router';
    import routes from './routes';

    location.subscribe((path) => {
        if(path.startsWith("/project")){
            // project route will change the title
        } else {
            document.title = 'chick_0';
        }
    });
</script>

<Router {routes} />

<section class="footer">
    <div class="container">
        <div class="colums">
            <div class="column">&copy; chick_0</div>
            <div class="column">
                <a href="https://github.com/chick0">Github</a>
            </div>
        </div>
    </div>
</section>