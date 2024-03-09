exports.login = async (req, res) => {
    try {
        const code = req.body.code;

        // Exchange the authorization code for an access token
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: JSON.stringify({
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: 'postmessage',
                grant_type: 'authorization_code'
            })
        });
        const data = await response.json();
        const accessToken = data.access_token;

        // Fetch user details using the access token
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const userData = await userResponse.json();

        res.status(201).send({ accessToken: accessToken, userData: userData });
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to save code");
    }

}

exports.getTokenInfos = async (req, res, next) => {
    const accessToken = req.headers['authorization'];

    if(!accessToken) {
        return res.status(401).send('Missing token.');
    }

    await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(user => {
        req.user = user.email;
        next();
    })
    .catch(err => {
        if(err.message.includes('401')) {
            return res.status(401).send('Invalid credentials');
        }
        return res.status(500).send('Internal server error.');
    });
}