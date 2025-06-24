chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveToNotion") {
    const data = message.data;
    const db_id = "1cfcd4e10e0380fc9ddffd4436f1a99e";
    const notion_api = "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";

    const payload = {
      parent: { database_id: db_id },
      properties: {
        "Problem No.": {
          title: [
            {
              text: {
                content: `${data.problemNo}`,
              },
            },
          ],
        },
        "Problem Name": {
          rich_text: [
            {
              text: {
                content: `${data.problemName}`,
              },
            },
          ],
        },
        "link": {
          rich_text: [
            {
              text: {
                content: data.url,
              },
            },
          ],
        },
        "Platform": {
          select: {
            name: "LeetCode",
          },
        },
        "Difficulty": {
          select: {
            name: data.difficulty,
          },
        },
      },
    };

    console.log("📤 Sending request to Notion...");

    fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notion_api}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((responseData) => {
        console.log("✅ Notion API response:", responseData);
        if (responseData.object === "error") {
          sendResponse({
            status: "Notion API error",
            error: responseData.message,
          });
        } else {
          sendResponse({
            status: "Saved to Notion successfully!",
            notionPageUrl: responseData.url,
          });
        }
      })
      .catch((error) => {
        console.error("❌ Error saving to Notion:", error);
        sendResponse({
          status: "Error saving to Notion",
          error: error.message,
        });
      });

    return true; // <-- keeps message channel alive for async sendResponse
  }
});
