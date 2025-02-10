import express from 'express'; //express server framework, import provided by node.js
import pg from 'pg'; //postgres database, import provided by node.js
import cors from 'cors'; //cross origin resource sharing, import provided by node.js (allows for communication between different servers)
import dotenv from 'dotenv'; //environment variables, import provided by node.js

dotenv.config(); //load environment variables from a .env file into process.env to access them in the application

const { Pool } = pg; //extract the Pool object from the pg module

const app = express(); //create an express application
const port = 5001; //port number for the server to listen on

const pool = new Pool({ //create a new pool object to connect to the database
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, //database info for connection
});

const corsOptions = {
    origin: ["http://localhost:5000"], //allow requests from multiple origins
};

app.use(cors(corsOptions)); //use cors middleware with specified options


app.get('/api/menu', async (req, res) => { //listen for GET requests to the /api/menu endpoint
    const { category } = req.query; //extract the category query parameter from the request to display the menu items based on the category
    const query = ` 
        SELECT mi.food_name, mi.category, mi.image_url, fp.size, fp.price
        FROM menu_item mi
        JOIN food_prices fp ON mi.menu_item_id = fp.menu_item_id
        ${category ? `WHERE mi.category = $1` : ''}
        ORDER BY mi.food_name, fp.size;
    `; //above is a query to fetch database information with provided query on pages, the shorthands are used to shorten the query. 
    //the above $1 is a placeholder for the category parameter thats going to be passed in by the pages
    const values = category ? [category] : []; //if the category exists, set the values array to the category, and make it an empty array if not
    try {
        const result = await pool.query(query, values); //pool.query is part of the pg module that provides a way to interact with the database in the node.js environment, takes params database query and values (takes arrays and you can use placeholders like $1, $2, etc which refer to the values in the array, uses one-based indexing)
        res.json(result.rows); //rows is a property of the result object, aka when you recieve data from the database it always has a rows section, and we convert this result to json since thats widely accepted for api info exchange and easy to use with react and extracting specific data, also its easy to send off with data exchanges online
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => { //listen to the port and print out the link to it
    console.log(`Server running on http://localhost:${port}`);
});
