const inputQ = getElById("inp")
const wrapper = getElsByClass("wrapper")[0]

inputQ.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (wrapper.childElementCount != 0) {
            wrapper.children[1].focus()
        }
    }
})

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
    inputQ.focus()
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

function makeUrlId(data, ID) {
    const filtered = data.filter(list => list["id"] === ID)
    if (filtered.length === 0) {
        return 0
    } else {
        maxId = 0
        filtered[0]["urls"].forEach((idToUrl) => {
            maxId = Math.max(maxId, idToUrl["id"])
        })
        return maxId + 1
    }
}

function addSummary(summary) {
    getDataAndDo((details) => {
        details.push({ id: makeId(details), summary: summary, urls: [], isOpened: false })
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

function changeIsOpened(ID, isOpened) {
    getDataAndDo((details) => {
        setData(changeData(details, ID, (e) => {
            e["isOpened"] = isOpened
        }))
    })
}

function changeSummary(ID, summary) {
    getDataAndDo((details) => {
        if (summary === "") {
            setData(details.filter(d => d["id"] !== ID))
        } else {
            setData(changeData(details, ID, (e) => {
                e["summary"] = summary
            }))
        }
    })
}

function addList(ID, url) {
    getDataAndDo((details) => {
        setData(changeData(details, ID, (e) => {
            e["urls"].push({ id: makeUrlId(details, ID), url: url })
        }))
    })
}

function changeList(ID, urlId, url) {
    getDataAndDo((details) => {
        setData(changeData(details, ID, (e) => {
            if (url === "") {
                e["urls"] = e["urls"].filter(idToUrl => idToUrl["id"] !== urlId)
            } else {
                const filtered = e["urls"].filter(idToUrl => idToUrl["id"] === urlId)
                if (filtered.length === 0) {
                    // do nothing
                } else {
                    filtered[0]["url"] = url
                }
            }
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
    details.open = lineData["isOpened"]
    const summary = document.createElement("summary")
    summary.textContent = lineData["summary"]
    summary.id = makeSummaryId(ID)
    details.appendChild(summary)

    lineData["urls"].forEach(idTourl => {
        const url = idTourl["url"]
        const li = document.createElement("li")
        const input = document.createElement("input")
        input.value = url
        input.name = idName
        li.appendChild(input)
        details.appendChild(li)
        addEventListenerKeydownAndBlur(input, () => {
            changeList(ID, idTourl["id"], input.value)
        })
    })
    const li = document.createElement("li")
    const inputNewUrl = document.createElement("input")
    inputNewUrl.placeholder = "new url"
    li.appendChild(inputNewUrl)
    details.appendChild(li)
    addEventListenerKeydownAndBlur(inputNewUrl, () => {
        if (inputNewUrl.value !== "") {
            addList(ID, inputNewUrl.value)
        }
    })
    wrapper.appendChild(details)

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
        changeIsOpened(ID, e.target.open)
        if (e.target.open) {
            const inputOfSummary = document.createElement("input")
            inputOfSummary.value = lineData["summary"]
            summary.textContent = ""
            summary.appendChild(inputOfSummary)

            addEventListenerKeydownAndBlur(inputOfSummary, () => changeSummary(ID, inputOfSummary.value))
        } else {
            const inputOfSummary = summary.getElementsByTagName("input")[0]
            inputOfSummary.remove()
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
    input.placeholder = "new group"
    input.tabIndex = "-1"
    wrapper.appendChild(input)
    addEventListenerKeydown(input, () => {
        if (input.value !== "") {
            addSummary(input.value)
        }
    })


}

function addEventListenerKeydownAndBlur(input, func) {
    addEventListenerBlur(input, func)
    addEventListenerKeydown(input, func)
}

function addEventListenerBlur(input, func) {
    input.addEventListener("blur", (e) => {
        func()
    })
}

function addEventListenerKeydown(input, func) {
    input.addEventListener("keydown", (e) => {
        if (isSubmit(e.key)) {
            func()
        }
    })
}


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
            detail["urls"].forEach(idToUrl => {
                window.open(idToUrl["url"] + inpv, "_blank")
            })
        })
    })
}