const API_KEY = process.env.VUE_APP_API_KEY;

export async function getBookFromIsbn(isbn) {
    try {
        if (sessionStorage.getItem(isbn)) {
            return JSON.parse(sessionStorage.getItem(isbn));

        } else {

            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`);
            if (!response.ok) {
                throw new Error(response.status);
            }
            const datas = await response.json();
            if (datas == null || datas.totalItems < 1) {
                return null;
            } else {
                const infos = datas.items[0].volumeInfo;
                const id = datas.items[0].id;

                const details = {
                    isbn: isbn,
                    title: infos.title,
                    authors: infos.authors,
                    description: infos.description,
                    publication: (new Date(infos.publishedDate)).getFullYear(),
                    image: `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`
                }

                sessionStorage.setItem(isbn, JSON.stringify(details));
                return details;
            }
        }

    } catch (err) {
        sessionStorage.removeItem(isbn);
        throw err;
    }
}