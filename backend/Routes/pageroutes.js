import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';



const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const router = express.Router();

router.get('/',(req,res)=>{
    try{
        res.sendFile(path.join(__dirname, '../../frontend/templates/index.html'));
    }catch(err){
        res.status(500).send('Error loading page');
        console.error(err);
    }
})

router.get('/naiyo24',(req,res)=>{
    try{
        res.sendFile(path.join(__dirname, '../../frontend/templates/naiyo24.html'));
    }catch(err){
        res.status(500).send('Error loading page');
        console.error(err);
    }
})
//PROJECTS ROUTES
router.get('/Forensify',(req,res)=>{
    try{
        res.sendFile(path.join(__dirname, '../../frontend/templates/Forensify.html'));
    }catch(err){
        res.status(500).send('Error loading page');
        console.error(err);
    }
})

export default router;