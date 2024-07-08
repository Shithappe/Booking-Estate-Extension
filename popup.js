const grabBtn = document.getElementById("grabBtn");

grabBtn.addEventListener("click",() => {    
    chrome.tabs.query({active: true}, (tabs) => {
        const tab = tabs[0];
        if (tab) {
            console.log(tab.id);
            // console.log(tab);
        } else {
            alert("There are no active tabs")
        }
    })
})