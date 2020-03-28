import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import EntryList from "../components/EntryList";
import ReadLater from "../components/ReadLater";

export default new Router({
  routes: [
    {
      path: "/",
      name: "entryList",
      component: EntryList
    },
    {
      path: "/readLater/:id",
      name: "readLater",
      props: true,
      component: ReadLater
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
