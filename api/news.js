const fetch = require('cross-fetch')
require('dotenv').config();

//fetch the data from api
//if response is bad throw an error
//store the json response in data and return it
let newsFetch = async (articleTypes) => {
    let apiLink = `https://newsapi.org/v2/everything?${articleTypes}&apiKey=${process.env.API_KEY}`;

    try {
        let response = await fetch(apiLink);

        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }

        let data = await response.json();
        return data;

    } catch (err) {
        console.error(err);
    }
}

module.exports = newsFetch;
