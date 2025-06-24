chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    const url = window.location.href;
    const slug = window.location.pathname.split("/")[2];

    function getProblemTitle() {
      const anchors = document.querySelectorAll(`a[href="/problems/${slug}/"]`);
      for (const a of anchors) {
        const text = a.innerText.trim();
        if (/^\d+\.\s+/.test(text)) return text;
      }
      return null;
    }

    const fullTitle = getProblemTitle();
    let problemNo = null;
    let problemName = null;

    if (fullTitle) {
      const match = fullTitle.match(/^(\d+)\.\s+(.*)$/);
      if (match) {
        problemNo = match[1];
        problemName = match[2];
      } else {
        problemName = fullTitle;
      }
    }

    const difficultyDiv = document.querySelector('div[class*="text-difficulty-"]');
    const difficulty = difficultyDiv ? difficultyDiv.innerText.trim() : null;

    console.log("Title:", fullTitle);
    console.log("Problem No:", problemNo);
    console.log("Problem Name:", problemName);
    console.log("Difficulty:", difficulty);

    sendResponse({
      url,
      problemNo,
      problemName,
      difficulty,
    });

    return true;
  }
});
