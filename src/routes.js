// Components
import Home from './routes/Home.svelte';
import Auth from './routes/Auth.svelte';
import Project from './routes/Project.svelte';
import History from './routes/History.svelte';

// Routes
export default {
    '/': Home,

    '/auth': Auth,
    '/auth/history': History,

    '/project/:uuid': Project,

    // '*': NotFound,
};