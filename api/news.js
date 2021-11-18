const fetch = require('cross-fetch')
require('dotenv').config();

let newsFetch = async (articleTypes) => {
    //link 
    let apiLink = `https://newsapi.org/v2/everything?${articleTypes}&apiKey=${process.env.API_KEY}`;

    try {
        //fetch the data from api
        let response = await fetch(apiLink);

        //if response is bad throw an error
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }

        //store the json response in data and return it
        let data = await response.json();
        return data;

    } catch (err) {
        console.error(err);
    }
}

module.exports = newsFetch;
