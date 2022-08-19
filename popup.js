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
function setData(data) {
    chrome.storage.sync.set({ detailsData: data })
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
        setData(details)
    })
}

function changeData(data, ID, func) {
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element["id"] === ID) {
            func(element)
            return data
        }
    }
}

function changeSummary(ID, summary) {
    getDataAndDo((details) => {
        setData(changeData(details, ID, (e) => {
            e["summary"] = summary
        }))
    })
}

function addList(ID, url) {
    getDataAndDo((details) => {
        setData(changeData(details, ID, (e) => {
            e["urls"].push(url)
        }))
    })
}

function isSubmit(key) {
    return key === "Enter" || key === "Tab"
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
    const inputNewUrl = document.createElement("input")
    details.appendChild(inputNewUrl)
    addEventListenerKeydown(inputNewUrl, () => {
        addList(ID, inputNewUrl.value)
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

    details.addEventListener("toggle", (e) => {
        if (e.target.open) {
            const inputOfSummary = document.createElement("input")
            inputOfSummary.value = lineData["summary"]
            summary.textContent = ""
            summary.appendChild(inputOfSummary)

            addEventListenerKeydown(inputOfSummary, () => changeSummary(ID, inputOfSummary.value))
        } else {
            const inputOfSummary = summary.getElementsByTagName("input")[0]
            inputOfSummary.remove()
            getDataAndDo(showData)
        }
    })
}

function showData(data) {
    wrapper.innerHTML = ""

    data.forEach(lineData => {
        makeLine(lineData)
    })

    // add input form to append group
    const input = document.createElement("input")
    input.tabIndex = "-1"
    wrapper.appendChild(input)
    addEventListenerKeydown(input, () => {
        if (input.value !== "") {
            addSummary(input.value)
        }
    })


}

function addEventListenerKeydown(input, func) {
    input.addEventListener("keydown", (e) => {
        if (isSubmit(e.key)) {
            func()
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