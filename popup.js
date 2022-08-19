const inputQ = getElById("inp")
const wrapper = getElsByClass("wrapper")[0]

// data for test
const testlist = [
    { id: 0, summary: "ITdes", list: ["aaaa", "bbbb"], key: "e" },
    { id: 1, summary: "ITdd", list: ["cc", "dd"], key: "e" }
]



window.onload = () => {
    makeLines()
}

function getData() {
    return testlist
}

function saveData() {

}

function makeDetailsId(id) {
    return "dt" + id
}

function makeButtonId(id) {
    return "btn" + id
}


function makeLine(lineData) {
    const details = document.createElement("details")
    const idName = makeDetailsId(lineData["id"])
    details.id = idName
    details.tabIndex = "-1"
    const summary = document.createElement("summary")
    summary.textContent = lineData["summary"]
    details.appendChild(summary)

    lineData["list"].forEach(url => {
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
    searchButton.id = makeButtonId(lineData["id"])
    const span = document.createElement("span")
    span.className = "material-symbols-outlined"
    span.style = "font-size: 15px;"
    span.textContent = "search"
    searchButton.appendChild(span)
    wrapper.appendChild(searchButton)
}

function makeLines() {
    const data = getData()
    data.forEach(lineData => {
        makeLine(lineData)
        getElById(makeButtonId(lineData["id"])).addEventListener("click", async () => {
            let urls = []
            getElsByName(makeDetailsId(lineData["id"])).forEach(a => urls.push(a.value))
            Search(urls, inputQ.value)
        });
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

function Search(urls, inpv) {
    urls.forEach(url => {
        window.open(url + inpv, "_blank")
    })
}