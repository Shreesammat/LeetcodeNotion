document.getElementById("send").addEventListener("click", () => {
  if (!document.getElementById("status")) {
    document.getElementById("status").textContent = "Sending...";
  }

  console.log(document.getElementById("status"));

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const successSound = new Audio(chrome.runtime.getURL("/success.mp3"));
    const failSound = new Audio(chrome.runtime.getURL("/failure.mp3"));

    chrome.tabs.sendMessage(activeTab.id, { action: "scrape" }, (response) => {
      if (chrome.runtime.lastError) {
        document.getElementById("status").textContent =
          "Error: " + chrome.runtime.lastError.message;
        return;
      }

      if (response) {
        successSound.play();
        document.getElementById(
          "status"
        ).textContent = `✅ Sent:\n${response.problemNo} [${response.difficulty}]`;
        console.log("Response data:", response);

        chrome.runtime.sendMessage(
          {
            action: "saveToNotion",
            data: response,
          },
          (saveResponse) => {
            // Check if the save was successful and update the popup
            if (saveResponse.status) {
              document.getElementById("status").textContent =
                saveResponse.status;
              // Display the link to the Notion page
              const notionLink = document.createElement("a");
              notionLink.href = saveResponse.notionPageUrl;
              notionLink.target = "_blank";
              notionLink.textContent = "View the page in Notion";
              document.getElementById("status").appendChild(notionLink);
            } else {
              document.getElementById(
                "status"
              ).textContent = `Error: ${saveResponse.error}`;
            }
          }
        );
      } else {
        failSound.play();
        document.getElementById("status").textContent = "No response from tab.";
      }
    });
  });
});
