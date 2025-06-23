chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === "scrape") {
        
        const url = window.location.href;
        
        const titleElement = document.querySelector('div[class*="h-full"] h1');

        let problemNo = null;
        let problemName = null;

        if (titleElement) {
            const titleText = titleElement.innerText.trim(); 
            const match = titleText.match(/^(\d+)\.\s+(.*)$/);

            if (match) {
                problemNo = match[1];
                problemName = match[2];
            } else {
                problemName = titleText;
            }
        }

        console.log(problemNo);
        console.log(problemName);

        const difficultyDiv = document.querySelector('div[class*="text-difficulty-"]');

        const difficulty = difficultyDiv ? difficultyDiv.innerText.trim(): null;

        
        console.log(difficulty);

        sendResponse({
            url, 
            problemNo,
            problemName,
            difficulty
        });

        

    }

    return true;
})