import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const notionApiUrl = 'https://api.notion.com/v1/pages'
const notion_token = process.env.INTEGRATION_KEY
const db_id = process.env.DB_ID

export async function addQuesToNotion(problemNo, problemName, topics, difficulty) {
    try {
        const response = await axios.post(
            notionApiUrl,
            {
                parent: { database_id: db_id },
                properties: {
                    "Problem No.": {
                        title: [
                            {
                                text: {
                                    content: problemNo.toString()
                                }
                            }
                        ]
                    },
                    "Problem Name": {
                        rich_text: [
                            {
                                text: {
                                    content: problemName.toString()
                                }
                            }
                        ]
                    },
                    "Platform": {
                        select: {
                            name: "LeetCode"
                        }
                    },
                    "Topic": {
                        multi_select: topics.map((topic) => ({ name: topic }))
                    },
                    "Difficulty": {
                        select: {
                            name: difficulty
                        }
                    }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${notion_token}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                }
            }
        )

        console.log('✅ Page created successfully:', response.data)
    } catch (error) {
        console.error('❌ Error creating page:', error.response?.data || error.message)
    }
}