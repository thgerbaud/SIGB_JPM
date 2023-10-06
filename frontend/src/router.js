import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [
		{
			path: "/",
			name: "login",
			component: () => import("./components/LoginForm")
		},
		{
			path: "/:user/libraries",
			name: "libraries",
			component: () => import("./components/LibrariesList")
		},
		{
			path: "/:user/create",
			name: "create-library",
			component: () => import("./components/CreateLibrary")
		},
		{
			path: "/:library/books",
			name: "books",
			component: () => import("./components/BooksList")
		},
		{
			path: "/:library/books/add",
			name: "add",
			component: () => import("./components/AddBook")
		},
		{
			path: "/:library/books/:id",
			name: "books-details",
			component: () => import("./components/BookItem")
		}
		
	]
});