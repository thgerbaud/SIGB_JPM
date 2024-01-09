import { createWebHistory, createRouter, RouterView, RouterLink } from "vue-router";
import store from "@/store";

RouterView.compatConfig = { MODE: 3 }
RouterLink.compatConfig = { MODE: 3 }

const checkAuth = (to, from, next) => {
	if(store.getters.isLoggedIn) {
		next();
	} else {
		next('/login');
	}
}

export default createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/login",
			alias: "/",
			name: "login",
			component: () => import("@/views/LoginView"),
			children: [
				{
					path: "",
					name: "login",
					component: () => import("@/components/LoginPage")
				}
			]
		},
		{
			path: "/home",
			name: "home",
			beforeEnter: checkAuth,
			component: () => import("../views/HomeView"),
			children: [
				{
					path: "libraries",
					name: "libraries",
					component: () => import("@/components/LibrariesPage")
				},
				{
					path: "create",
					name: "create-library",
					component: () => import("@/components/CreateLibrary")
				}
			]
		},
		{
			path: "/:library",
			name: "library",
			beforeEnter: checkAuth,
			component: () => import("@/views/LibraryView"),
			children: [
				{
					path: "books",
					name: "books",
					component: () => import("@/components/LibraryHome")
				},
				{
					path: "books/add",
					name: "add",
					component: () => import("@/components/AddBook")
				},
				{
					path: "books/:id",
					name: "books-details",
					component: () => import("@/components/BookPage")
				}
			]
		}
	]
});