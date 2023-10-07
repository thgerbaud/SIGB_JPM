import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("./views/HomeView"),
			children: [
				{
					path: "/",
					name: "login",
					component: () => import("./components/LoginForm")
				},
				{
					path: ":user/libraries",
					name: "libraries",
					component: () => import("./components/LibrariesList")
				},
				{
					path: ":user/create",
					name: "create-library",
					component: () => import("./components/CreateLibrary")
				}
			]
		},
		{
			path: "/:library",
			name: "library",
			component: () => import("./views/LibraryView"),
			children: [
				{
					path: "books",
					name: "books",
					component: () => import("./components/BooksList")
				},
				{
					path: "books/add",
					name: "add",
					component: () => import("./components/AddBook")
				},
				{
					path: "books/:id",
					name: "books-details",
					component: () => import("./components/BookItem")
				}
			]
		}
	]
});