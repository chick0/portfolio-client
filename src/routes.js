// Components
import Home from './routes/Home.svelte';
import Project from './routes/Project.svelte';

// Routes
export default {
    '/': Home,
    '/project/:uuid/:page?': Project,

    // '*': NotFound,
}