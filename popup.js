const inputQ = getElById("inp")
const wrapper = getElsByClass("wrapper")[0]


function getDataAndDo(func) {
    chrome.storage.sync.get(["detailsData"], (data) => {
        if (data.detailsData == null) {
            func([])
        } else {
            func(data.detailsData)
        }
    })
}

window.onload = () => {
    getDataAndDo(showData)
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.detailsData) {
        showData(changes.detailsData.newValue)
    }
})

function makeId(data) {
    maxId = 0
    data.forEach((list) => {
        maxId = Math.max(list["id"], maxId)
    })
    return maxId + 1
}

function addSummary(summary) {
    getDataAndDo((details) => {
        details.push({ id: makeId(details), summary: summary, urls: [], key: "e" })
        showData(details)
    })
}

function addList() {

}

function makeDetailsId(id) {
    return "dt" + id
}

function makeButtonId(id) {
    return "btn" + id
}
function makeSummaryId(id) {
    return "sum" + id
}

// use in showData
function makeLine(lineData) {
    const ID = lineData["id"]
    const details = document.createElement("details")
    const idName = makeDetailsId(ID)
    details.id = idName
    details.tabIndex = "-1"
    const summary = document.createElement("summary")
    summary.textContent = lineData["summary"]
    summary.id = makeSummaryId(ID)
    details.appendChild(summary)

    lineData["urls"].forEach(url => {
        const li = document.createElement("li")
        const input = document.createElement("input")
        input.value = url
        input.name = idName
        li.appendChild(input)
        details.appendChild(li)
    })
    wrapper.appendChild(details)

    const press = document.createElement("label")
    press.textContent = "press"
    wrapper.appendChild(press)

    const inputKey = document.createElement("input")
    inputKey.type = "text"
    inputKey.maxLength = "1"
    inputKey.tabIndex = "-1"
    wrapper.appendChild(inputKey)
    const to = document.createElement("label")
    to.textContent = "to"
    wrapper.appendChild(to)

    const searchButton = document.createElement("button")
    searchButton.id = makeButtonId(ID)
    const span = document.createElement("span")
    span.className = "material-symbols-outlined"
    span.style = "font-size: 15px;"
    span.textContent = "search"
    searchButton.appendChild(span)
    wrapper.appendChild(searchButton)

    searchButton.addEventListener("click", async () => {
        Search(ID, inputQ.value)
    });
}

function showData(data) {
    wrapper.innerHTML = ""

    data.forEach(lineData => {
        makeLine(lineData)

        // link search button to Search
        // getElById(makeButtonId(lineData["id"])).addEventListener("click", async () => {
        //     let urls = []
        //     getElsByName(makeDetailsId(lineData["id"])).forEach(a => urls.push(a.value))
        //     Search(urls, inputQ.value)
        // });

        // summary to input
        getElById(makeDetailsId(lineData["id"])).addEventListener("toggle", (e) => {
            summary = getElById(makeSummaryId(lineData["id"]))
            if (e.target.open) {
                const inputOfSummary = document.createElement("input")
                inputOfSummary.value = summary.textContent
                summary.textContent = ""
                summary.appendChild(inputOfSummary)
            } else {
                const inputOfSummary = summary.getElementsByTagName("input")[0]
                summary.textContent = inputOfSummary.value
                inputOfSummary.remove()
            }
        })
    })

    // add input form to append group
    const input = document.createElement("input")
    input.tabIndex = "-1"
    wrapper.appendChild(input)
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            if (input.value !== "") {
                addSummary(input.value)
            }
        }
    })


}



inputQ.addEventListener('focus', (event) => {
    event.target.style.backgroundColor = "aqua";
    wrapper.style.backgroundColor = ""
});

inputQ.addEventListener('blur', (event) => {
    event.target.style.background = '';
    wrapper.style.backgroundColor = "aqua"
});

function getElById(id) {
    return document.getElementById(id)
}

function getElsByName(name) {
    return document.getElementsByName(name)
}

function getElsByClass(className) {
    return document.getElementsByClassName(className)
}

function Search(ID, inpv) {
    getDataAndDo((details) => {
        details.filter(d => d["id"] === ID).forEach((detail) => {
            detail["urls"].forEach(url => {
                window.open(url + inpv, "_blank")
            })
        })
    })
}