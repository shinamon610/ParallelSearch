const inputQ = getElById("inp")

getElById("btn0").addEventListener("click", async () => {
    let urls = []
    getElsByName("dt0").forEach(a => urls.push(a.value))
    onRun(urls, inputQ.value)
});


inputQ.addEventListener('focus', (event) => {
    event.target.style.backgroundColor = "aqua";
    getElsByClass("wrapper")[0].style.backgroundColor = ""
});

inputQ.addEventListener('blur', (event) => {
    event.target.style.background = '';
    getElsByClass("wrapper")[0].style.backgroundColor = "aqua"
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

function onRun(urls, inpv) {
    urls.forEach(url => {
        window.open(url + inpv, "_blank")
    })
}