import {Pool} from "pg";

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

pool.connect((err , client , release)=>{
    if(err){
        console.log(`❌ Error connecting to the database:` , err.stack)
    }
    else{
        console.log('✅ Connected to PostgreSQL database');
        release()
    }
})

export default pool;