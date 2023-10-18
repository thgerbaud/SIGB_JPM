import { createMemoryHistory, createRouter, RouterView, RouterLink } from "vue-router";

RouterView.compatConfig = { MODE: 3 }
RouterLink.compatConfig = { MODE: 3 }

export default createRouter({
	history: createMemoryHistory(),
	routes: [
		{
			path: "/login",
			alias: "/",
			name: "login",
			component: () => import("../views/LoginView"),
			children: [
				{
					path: "",
					name: "login",
					component: () => import("../components/LoginForm")
				}
			]
		},
		{
			path: "/home",
			name: "home",
			component: () => import("../views/HomeView"),
			children: [
				{
					path: "libraries",
					name: "libraries",
					component: () => import("../components/LibrariesList")
				},
				{
					path: "create",
					name: "create-library",
					component: () => import("../components/CreateLibrary")
				}
			]
		},
		{
			path: "/:library",
			name: "library",
			component: () => import("../views/LibraryView"),
			children: [
				{
					path: "books",
					name: "books",
					component: () => import("../components/LibraryHome")
				},
				{
					path: "books/add",
					name: "add",
					component: () => import("../components/AddBook")
				},
				{
					path: "books/:id",
					name: "books-details",
					component: () => import("../components/BookItem")
				}
			]
		}
	]
});