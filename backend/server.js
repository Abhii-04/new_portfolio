import express from 'express';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);
const app = express();
app.set("views", path.join(__dirname, "../frontend/templates"));


app.use(cookieParser());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave:false,
        saveUnintialized:false,
        cookie:{
            secure:false,  //set to true if using https
            httponly:true,
            sameSite:'lax',
            maxAge:1000*60*60*24  //set for 1 day
        },
    })
);



//middleware
app.use(express.static(path.join(__dirname,'../frontend')));

// Import routes
import pageRoutes from './Routes/pageroutes.js';
app.use('/', pageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});