import { createStore } from 'vuex';

export default createStore({
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
		}
	},
});