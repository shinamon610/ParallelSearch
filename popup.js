document.getElementById("btn").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: onRun,
    });
});

function onRun() {
    chrome.storage.sync.get(null, (options) => {
        document.body.style.backgroundColor = options.colorValue;
    });
}