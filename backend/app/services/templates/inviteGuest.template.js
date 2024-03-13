module.exports = {
    text: (sender, library, code) => `
	${sender} vous invite à rejoindre sa bibliothèque ${library.name} !
	${process.env.SERVER_URL}/api/libraries/${library.id}/users?code=${code}
	`,
    html: (sender, library, code) => `
    <!DOCTYPE html>

    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            #main {
                padding: 1rem;
                font-family: Arial, Helvetica, sans-serif;
                text-align: center;
            }
    
            p {
                font-size: 1rem;
            }

            a {
                cursor: pointer;
                color: #000000;
            }
    
            button {
                background-color: #a37e50;
                border: none;
                border-radius: 5px;
                font-size: 1rem;
                padding: 0.5rem 1rem;
                color: #ffffff;
            }
        </style>
    </head>
    
    <body>
        <div id="main">
            <p>${sender} vous invite à rejoindre sa bibliothèque <b>${library.name}</b> !</p>
            <a href="${process.env.SERVER_URL}/api/libraries/${library.id}/users?code=${code}">
                <button>Accepter l'invitation</button>
            </a>
            <div>
    </body>
    
    </html>
`
}