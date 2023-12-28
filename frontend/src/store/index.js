import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
	storage: window.localStorage
})

export default createStore({
	plugins: [vuexLocal.plugin],
	state: {
		user: null,
		token: null,
	},
	mutations: {
		setUser(state, user) {
			state.user = user;
		},
		setToken(state, token) {
			state.token = token;
		},
		logout(state) {
			state.token = null;
			state.user = null;
		}
	},
	actions: {

	},
	getters: {
		isLoggedIn(state) {
			return !!state.token;
		},
		getUser(state) {
			return state.user;
		},
		getToken(state) {
			return state.token;
		}
	},
});