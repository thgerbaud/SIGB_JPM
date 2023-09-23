import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/books",
      name: "books",
      component: () => import("./components/BooksList")
    },
    {
      path: "/books/:id",
      name: "books-details",
      component: () => import("./components/BookItem")
    },
    {
      path: "/add",
      name: "add",
      component: () => import("./components/AddBook")
    }
  ]
});