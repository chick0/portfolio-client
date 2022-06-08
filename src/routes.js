// Home
import Home from './routes/Home.svelte';
// Auth
import Auth from './routes/Auth.svelte';
import History from './routes/History.svelte';
import Logout from './routes/Logout.svelte';
// Project
import NewProject from './routes/NewProject.svelte';
import Project from './routes/Project.svelte';
import ProjectEdit from './routes/ProjectEdit.svelte';
// etc..
import Build from './routes/Build.svelte';
import NotFound from './NotFound.svelte';

// Routes
export default {
    '/': Home,

    '/auth': Auth,
    '/auth/history': History,
    '/auth/logout': Logout,

    '/new-project': NewProject,
    '/project/:uuid': Project,
    '/project/:uuid/edit': ProjectEdit,

    '/build': Build,
    '*': NotFound,
};