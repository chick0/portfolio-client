import { wrap } from "svelte-spa-router/wrap";

import Home from "./routes/Home.svelte";
import Project from "./routes/Project.svelte";

export default {
    "/": Home,

    "/auth": wrap({
        asyncComponent: () => import("./routes/Auth.svelte"),
    }),
    "/auth/logout": wrap({
        asyncComponent: () => import("./routes/Logout.svelte"),
    }),
    "/auth/session": wrap({
        asyncComponent: () => import("./routes/Session.svelte"),
    }),

    "/new-project": wrap({
        asyncComponent: () => import("./routes/NewProject.svelte"),
    }),

    "/project/:uuid": Project,
    "/project/:uuid/edit": wrap({
        asyncComponent: () => import("./routes/ProjectEdit.svelte"),
    }),

    "/storage": wrap({
        asyncComponent: () => import("./routes/Storage.svelte"),
    }),

    "/build": wrap({
        asyncComponent: () => import("./routes/Build.svelte"),
    }),

    "*": wrap({
        asyncComponent: () => import("./NotFound.svelte"),
    }),
};
