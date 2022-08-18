document.getElementById("btn").addEventListener("click", async () => {
    onRun(document.getElementById("inp").value)
});

function onRun(inp) {
    console.log(inp)
    window.open("https://stackoverflow.com/search?q=" + inp, "_blank")
}