// Components
import Home from './routes/Home.svelte';
import Project from './routes/Project.svelte';

// Routes
export default {
    '/:page?': Home,
    '/project/:uuid/:page?': Project,

    // '*': NotFound,
}