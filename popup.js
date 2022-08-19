document.getElementById("btn0").addEventListener("click", async () => {
    let urls = []
    getElByName("dt0").forEach(a => urls.push(a.value))
    onRun(urls, getElById("inp").value)
});

function getElById(id) {
    return document.getElementById(id)
}

function getElByName(name) {
    return document.getElementsByName(name)
}

function onRun(urls, inpv) {
    urls.forEach(url => {
        window.open(url + inpv, "_blank")
    })
}