const API_KEY = process.env.VUE_APP_API_KEY;

export async function getBookFromIsbn(isbn) {
    const infos = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`, {
        method: "GET"
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        } else {
            return response.json();
        }
    }).then(datas => {
        if (datas == null || datas.totalItems < 1) {
            return null;
        } else {
            const infos = datas.items[0].volumeInfo;
            const id = datas.items[0].id;

            return {
                isbn: isbn,
                title: infos.title,
                authors: infos.authors,
                description: infos.description,
                image: `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
                publication: (new Date(infos.publishedDate)).toDateString()
            }
        }
    }).catch(err => {
        throw err;
    });
    return infos;
}