import { createWebHistory, createRouter, RouterView, RouterLink } from "vue-router";
import { useUserStore } from '@/store/user';


RouterView.compatConfig = { MODE: 3 }
RouterLink.compatConfig = { MODE: 3 }

const checkAuth = (to, from, next) => {
	const userStore = useUserStore();
	if(userStore.isLoggedIn) {
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
			name: "login",
			component: () => import("@/views/LoginView"),
			children: [
				{
					path: "",
					name: "login",
					component: () => import("@/pages/LoginPage"),
				},
			],
		},
		{
			path: "/",
			name: "home",
			beforeEnter: checkAuth,
			component: () => import("../views/HomeView"),
			children: [
				{
					path: "",
					name: "libraries",
					component: () => import("@/pages/LibrariesPage"),
				},
				{
					path: "create-library",
					name: "create-library",
					component: () => import("@/pages/CreateLibrary"),
				},
			],
		},
		{
			path: "/:library",
			name: "library",
			beforeEnter: checkAuth,
			component: () => import("@/views/LibraryView"),
			children: [
				{
					path: "",
					name: "books",
					component: () => import("@/pages/LibraryHome"),
				},
				{
					path: "add-book",
					name: "add-book",
					component: () => import("@/pages/AddBookPage"),
				},
				{
					path: ":book",
					name: "book-details",
					component: () => import("@/pages/BookPage"),
				},
				{
					path: "settings",
					name: "settings",
					component: () => import("@/pages/SettingsPage"),
				},
			],
		},
	],
});