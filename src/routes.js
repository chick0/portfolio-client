// Components
import Home from './routes/Home.svelte';
import Project from './routes/Project.svelte';
import Auth from './routes/Auth.svelte';

// Routes
export default {
    '/': Home,
    '/project/:uuid/:page?': Project,
    '/auth': Auth,

    // '*': NotFound,
};