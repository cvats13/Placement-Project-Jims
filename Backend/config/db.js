const mysql=require('mysql2');
require('dotenv').config();
const host=process.env.DB_HOST;
const user=process.env.DB_USER;
const password=process.env.DB_PASSWORD;
const database=process.env.DB_NAME;

const pool=mysql.createPool({
    host:host,
    user:user,
    password:password,
    database:database,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});

pool.getConnection((err, connection)=>{
    if(err){
        console.error("Error connecting to the database:", err);
    }else{
        console.log("Connected to the database successfully!");
        connection.release();
    }
});

module.exports=pool.promise();