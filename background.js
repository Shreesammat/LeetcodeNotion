chrome.runtime.onMessage.addListener((message, sendResponse) => {
    if (message.action === "saveToNotion") {
        const data = message.data;
        const db_id = "1cfcd4e10e0380fc9ddffd4436f1a99e";
        const notion_api = "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";

        const payload = {
            parent: { database_id: db_id },
            properties: {
                "Problem No.": {
                    title: [
                        {   icon: {
                                
                            },
                            text: {
                                content: `${data.problemNo}`
                            }
                        }
                    ]
                },
                "Problem Name": {
                    rich_text: [
                        {
                            text: {
                                content: `${data.problemName}`
                            }
                        }
                    ]
                },
                "link": {
                    rich_text: [
                        {
                            text: {
                                content: data.url
                            }
                        }
                    ]
                },
                "Platform": {
                    select: {
                        name: "LeetCode"
                    }
                },
                "Difficulty": {
                    select: {
                        name: data.difficulty
                    }
                }
            }
        };

        console.log("Sending request to Notion...");
        
        // Send request to Notion API to save the data
        fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notion_api}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(responseData => {
            console.log("Notion API response received:", responseData);
            // Send a success response to the popup with the Notion page URL
            const notionPageUrl = responseData.url;
            sendResponse({
                status: "Saved to Notion successfully!",
                notionPageUrl: notionPageUrl
            });
        })
        .catch(error => {
            console.error("Error saving to Notion:", error);
            sendResponse({
                status: "Error saving to Notion",
                error: error.message
            });
        });

        // Return true to keep the response open for the async request
        return true;
    }
});
