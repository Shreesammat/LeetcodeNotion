import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { addQuesToNotion } from './notion.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', async( req, res) => {
    console.log("Welcome to the notion personal server");
})

app.post('/api/add_ques', async (req, res) => {
    try {
        const {title, content } = req.body;
        const response = await addQuesToNotion(title, content);
        res.status(200).json({
            success: true,
            data: response
        })
    }

    catch {
        console.error('Error adding question data', error.message)
        res.status(500).json({success: false, error: error.message})
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Server running`)
})