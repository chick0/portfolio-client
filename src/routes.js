// Home
import Home from "./routes/Home.svelte";
// Auth
import Auth from "./routes/Auth.svelte";
import Logout from "./routes/Logout.svelte";
import Session from "./routes/Session.svelte";
// Project
import NewProject from "./routes/NewProject.svelte";
import Project from "./routes/Project.svelte";
import ProjectEdit from "./routes/ProjectEdit.svelte";
// Storage
import Storage from "./routes/Storage.svelte";
// etc..
import Build from "./routes/Build.svelte";
import NotFound from "./NotFound.svelte";

// Routes
export default {
    "/": Home,

    "/auth": Auth,
    "/auth/logout": Logout,
    "/auth/session": Session,

    "/new-project": NewProject,
    "/project/:uuid": Project,
    "/project/:uuid/edit": ProjectEdit,

    "/storage": Storage,

    "/build": Build,
    "*": NotFound,
};
