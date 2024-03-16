import { useUserStore } from '@/store/user';

const userStore = useUserStore();


const BASE_URL = process.env.VUE_APP_BASE_URL_API + "libraries/";

/**
 * Permet de récupérer toutes les bibliothèques de l'utilisateur.
 * @returns {Promise<Object[]>} liste des bibliothèques
 * @throws code http et message de la réponse en cas d'échec
 */
export async function getAll() {
	const libraries = await fetch(BASE_URL, {
		method: 'GET',
		headers: {
			"Authorization": userStore.token,
		}
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//401 invalid credentials
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return libraries;
}

/**
 * Permet de récupérer une bibliothque par son identifiant.
 * @param {String} id identifiant de la bibliothèque
 * @returns {Promise<Object>} bibliothèque
 * @throws code http et message de la réponse en cas d'échec
 */
export async function getLibrary(id) {
	const library = await fetch(BASE_URL + id, {
		method: 'GET',
		headers: {
			"Authorization": userStore.token,
		}
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//401 invalid credentials
			//403 access denied
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet de récupérer les livres d'une bibliothèque.
 * @param {String} id identifiant de la bibliothèque
 * @returns {Promise<Object[]>} liste des livres
 * @throws code http et message de la réponse en cas d'échec
 */
export async function getBooks(id) {
	const books = await fetch(BASE_URL + id + '/books', {
		method: 'GET',
		headers: {
			"Authorization": userStore.token,
		}
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//401 invalid credentials
			//403 access denied
			//404 library not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return books;
}

/**
 * Permet de créer une bibliothèque.
 * @param {Object} payload paramètres de la bibliothèque
 * @returns {Promise<Object>} bibliothèque créée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function create(payload) {
	const library = await fetch(BASE_URL, {
		method: 'POST',
		headers: {
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify(payload)
	}).then(async res => {
		if (res.status === 201) {
			return res.json()
		} else {
			//400 name missing
			//401 invalide credentials
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet d'inviter un administrateur.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} adminEmail adresse courriel de l'administrateur
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function addAdmin(id, adminEmail) {
	const library = await fetch(BASE_URL + `${id}/admins`, {
		method: 'POST',
		headers: {
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify({ email: adminEmail })
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid parameters/already exists
			//401 invalid credentials
			//403 access denied
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet d'exclure un administrateur.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} adminId identifiant de l'administrateur
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function deleteAdmin(id, adminId) {
	const library = await fetch(BASE_URL + `${id}/admins/${adminId}`, {
		method: 'DELETE',
		headers: {
			"Authorization": userStore.token,
		}
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//409 already exists
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet d'inviter un utilisateur.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} guestEmail adresse courriel de l'utilisateur
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function addGuest(id, guestEmail) {
	const library = await fetch(BASE_URL + `${id}/users`, {
		method: 'POST',
		headers: {
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify({ email: guestEmail })
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//409 already exists
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet d'exclure un utilisateur.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} guestId identifiant de l'utilisateur
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function deleteGuest(id, guestId) {
	const library = await fetch(BASE_URL + `${id}/users/${guestId}`, {
		method: 'DELETE',
		headers: {
			"Authorization": userStore.token,
		}
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet d'ajouter un emplacement.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} name nom de l'emplacement
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function addLocation(id, name) {
	const library = await fetch(BASE_URL + `${id}/locations`, {
		method: 'POST',
		headers: {
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify({ name })
	}).then(async res => {
		if (res.status === 201) {
			return res.json();
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//409 duplicate location name
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet de modifier un emplacement.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} locationId identifiant de l'emplacement
 * @param {String} name nouveau nom
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function editLocation(id, locationId, name) {
	const library = await fetch(BASE_URL + `${id}/locations/${locationId}`, {
		method: 'PUT',
		headers: {
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify({ name })
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//409 duplicate location name
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet de supprimer un emplacement.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} locationId identifiant de l'emplacement
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function deleteLocation(id, locationId) {
	const library = await fetch(BASE_URL + `${id}/locations/${locationId}`, {
		method: 'DELETE',
		headers: {
			"Authorization": userStore.token,
		}
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet d'ajouter une catégorie.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} name nom de la catégorie
 * @param {String?} parent identifiant de la catégorie parente (optionnel)
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function addCategory(id, name, parent = undefined) {
	const library = await fetch(BASE_URL + `${id}/categories`, {
		method: 'POST',
		headers: {
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify((parent) ? { name, parent } : { name })
	}).then(async res => {
		if (res.status === 201) {
			return res.json();
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//409 duplicate category name
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet de modifier un catégorie.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} categoryId identifiant de la catégorie
 * @param {String} name nouveau nom
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function editCategory(id, categoryId, name) {
	const library = await fetch(BASE_URL + `${id}/categories/${categoryId}`, {
		method: 'PUT',
		headers: {
			"Authorization": userStore.token,
			"Content-type": "application/json"
		},
		body: JSON.stringify({ name })
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//409 duplicate category name
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet de supprimer une catégorie.
 * @param {String} id identifiant de la bibliothèque
 * @param {String} categoryId identifiant de la catégorie
 * @returns {Promise<Object>} bibliothèque modifiée
 * @throws code http et message de la réponse en cas d'échec
 */
export async function deleteCategory(id, categoryId) {
	const library = await fetch(BASE_URL + `${id}/categories/${categoryId}`, {
		method: 'DELETE',
		headers: {
			"Authorization": userStore.token,
		},
	}).then(async res => {
		if (res.status === 200) {
			return res.json();
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return library;
}

/**
 * Permet de supprimer une bibliothèque.
 * @param {String} id identifiant de la bibliothèque
 * @returns {void}
 * @throws code http et message de la réponse en cas d'échec
 */
export async function deleteLibrary(id) {
	await fetch(BASE_URL + id, {
		method: 'DELETE',
		headers: {
			"Authorization": userStore.token,
		},
	}).then(async res => {
		if (res.status === 204) {
			return;
		} else {
			//400 invalid parameters
			//401 invalid credentials
			//403 access denied
			//404 not found
			//500 internal error
			const message = await res.text();
			throw new Error(`[${res.status.toString()}] ${message}`);
		}
	}).catch(err => {
		throw err;
	});

	return;
}