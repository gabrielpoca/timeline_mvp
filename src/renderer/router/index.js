import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import EntriesPage from "../components/EntriesPage";
import ReadLater from "../components/ReadLater";

export default new Router({
  routes: [
    {
      path: "/",
      name: "entries",
      component: EntriesPage,
    },
    {
      path: "/readLater/:id",
      name: "readLater",
      props: true,
      component: ReadLater,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
