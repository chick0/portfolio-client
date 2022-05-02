// Components
import Home from './routes/Home.svelte';
import Auth from './routes/Auth.svelte';
import Project from './routes/Project.svelte';
import NewProject from './routes/NewProject.svelte';
import ProjectEdit from './routes/ProjectEdit.svelte';
import History from './routes/History.svelte';

// Routes
export default {
    '/': Home,

    '/auth': Auth,
    '/auth/history': History,

    '/project/:uuid': Project,
    '/new-project': NewProject,
    '/project/:uuid/edit': ProjectEdit,

    // '*': NotFound,
};