//import store from "@/store";
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const BASE_URL = process.env.VUE_APP_BASE_URL_API + "books/";

/**
 * Permet de récupérer un livre.
 * @param {String} bookId identifiant du livre
 * @returns {Promise<Object>} livre correspondant
 * @throws code http et message de la réponse en cas d'échec
 */
export async function getBook(bookId) {
	const book = await fetch(BASE_URL + bookId, {
		method: 'GET',
		headers: {
			//"Authorization": store.getters.getToken,
			"Authorization": userStore.token,
		}
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//401 invalid credentials
			//403 access denied
			//404 book not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return book;
}

/**
 * Permet de créer un livre.
 * @param {Object} payload n°ISBN, code, emplacement et catégorie du livre
 * @returns {Promise<Object>} livre créé
 * @throws code http et message de la réponse en cas d'échec
 */
export async function create(payload) {
	const book = await fetch(BASE_URL, {
		method: 'POST',
		headers: {
			//"Authorization": store.getters.getToken,
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify(payload)
	}).then(async res => {
		if (res.status === 201) {
			return res.json();
		} else {
			//400 invalid/missing field
			//401 invalid credentials
			//403 unauthorized
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return book;
}

/**
 * Permet de modifier un livre.
 * @param {String} bookId id du livre à modifier
 * @param {Object} payload paramètres à modifier
 * @returns {Promise<Object>} livre modifié
 * @throws code http et message de la réponse en cas d'échec
 */
export async function update(bookId, payload) {
	const book = await fetch(BASE_URL + bookId, {
		method: 'PUT',
		headers: {
			//"Authorization": store.getters.getToken,
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify(payload)
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid field
			//401 invalid credentials
			//403 unauthorized
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return book;
}

/**
 * Permet d'ajouter un exemplaire d'un livre.
 * @param {String} bookId id du livre
 * @param {Object} payload nouvel exemplaire
 * @returns {Object} livre modifié
 */
export async function addCopy(bookId, payload) {
	const book = await fetch(BASE_URL + `${bookId}/copies`, {
		method: 'POST',
		headers: {
			//"Authorization": store.getters.getToken,
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify(payload)
	}).then(async res => {
		if (res.status === 201) {
			return res.json();
		} else {
			//400 invalid field
			//401 invalid credentials
			//403 unauthorized
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return book;
}

/**
 * Permet de modifier un exemplaire.
 * @param {*} bookId id du livre
 * @param {*} copyId id de l'exemplaire
 * @param {*} payload paramètres à modifier
 * @returns {Object} livre mis à jour
 */
export async function updateCopy(bookId, copyId, payload) {
	const updatedBook = await fetch(BASE_URL + `${bookId}/copies/${copyId}`, {
		method: 'PUT',
		headers: {
			//"Authorization": store.getters.getToken,
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify(payload)
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid id or field
			//401 invalid credentials
			//403 unauthorized
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return updatedBook;
}

/**
 * Permet de supprimer un exemplaire d'un livre.
 * @param {String} bookId id du livre
 * @param {String} copyId id de l'exemplaire
 * @returns {Object} livre modifié s'il reste au moins un exemplaire
 */
export async function deleteCopy(bookId, copyId) {
	const updatedBook = await fetch(BASE_URL + `${bookId}/copies/${copyId}`, {
		method: 'DELETE',
		headers: {
			//"Authorization": store.getters.getToken,
			"Authorization": userStore.token,
		},
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else if (res.status === 204) {
			return null;
		} else {
			//400 invalid id
			//401 invalid credentials
			//403 unauthorized
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return updatedBook;
}

/**
 * Permet de supprimer un livre.
 * @param {String} bookId id du livre à supprimer
 * @returns {Promise<vobookId>}
 * @throws code http et message de la réponse en cas d'échec
 */
export async function deleteBook(bookId) {
	await fetch(BASE_URL + bookId, {
		method: 'DELETE',
		headers: {
			//"Authorization": store.getters.getToken,
			"Authorization": userStore.token,
		},
	}).then(async res => {
		if (res.status === 204) {
			return;
		} else {
			//400 invalid field
			//401 invalid credentials
			//403 unauthorized
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});
}