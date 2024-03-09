module.exports = {
    text: (sender, libraryName) => `
	${sender} vous invite à rejoindre sa bibliothèque ${libraryName} en tant qu'administrateur !
	http://google.com
	`,
    html: (sender, libraryName) => `
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
            <p>${sender} vous invite à rejoindre sa bibliothèque <b>${libraryName}</b> en tant qu'administrateur !</p>
            <a href="http://google.com">
                <button>Accepter l'invitation</button>
            </a>
            <div>
    </body>
    
    </html>
`
}