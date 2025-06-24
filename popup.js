document.getElementById("send").addEventListener("click", () => {
  const statusElement = document.getElementById("status");
  const successSound = new Audio(chrome.runtime.getURL("success.mp3"));
  const failSound = new Audio(chrome.runtime.getURL("failure.mp3"));

  statusElement.textContent = "Sending...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    chrome.tabs.sendMessage(activeTab.id, { action: "scrape" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        failSound.play();
        statusElement.textContent = "❌ Error: " + (chrome.runtime.lastError?.message || "No response");
        return;
      }

      console.log("Scraped Response:", response);

      chrome.runtime.sendMessage(
        {
          action: "saveToNotion",
          data: response,
        },
        (saveResponse) => {
          if (saveResponse.status && !saveResponse.error) {
            successSound.play();
            statusElement.textContent = `✅ ${saveResponse.status}`;

            // Link to Notion page
            const notionLink = document.createElement("a");
            notionLink.href = saveResponse.notionPageUrl;
            notionLink.target = "_blank";
            notionLink.textContent = " → View in Notion";
            notionLink.style.display = "block";
            statusElement.appendChild(notionLink);
          } else {
            failSound.play();
            statusElement.textContent = `❌ Error: ${saveResponse.error || "Unknown error"}`;
          }
        }
      );
    });
  });
});