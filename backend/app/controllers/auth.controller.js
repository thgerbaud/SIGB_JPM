exports.login = async (req, res) => {
    try {
        const code = req.body.code;
        console.log('Authorization Code:', code);

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
        console.log(data);
        //const accessToken = response.data.access_token;
        //console.log('Access Token:', accessToken);
        /*
        // Fetch user details using the access token
        const userResponse = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );*/
        //const userDetails = userResponse.data;
        //console.log('User Details:', userDetails);
        res.send("ok");
    } catch (error) {
        console.log(error);
        res.send("error");
    }

}