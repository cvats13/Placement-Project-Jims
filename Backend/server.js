const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./config/db');

app.use(express.json());


app.listen(port,()=>{
    console.log("Server is running on port:", port);
})

