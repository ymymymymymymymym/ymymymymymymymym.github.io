document.addEventListener("DOMContentLoaded", function () {
    const elements = ["header", "totop", "home", "groups", "members", "pairs"];
    elements.forEach(element => {
        //loadContent(`https://ykmsms.github.io/dansiren/parts/${element}.html`, element);
        while (true) {
            try {
                loadItem(element);
                break;
            } catch {
                continue;
            }
        }
    });
});

//パーツの一括読み込み
function loadItem(parts) {
    if (document.getElementById(parts) != null) {
        loadContent(`https://ykmsms.github.io/dansiren/parts/${parts}.html`, parts);
        const body = document.querySelector("body");
        const partsJS = document.createElement("script");
        partsJS.src = `https://ykmsms.github.io/dansiren/parts/${parts}.js`;
        body.appendChild(partsJS);
    } else {
        return;
    }
}

//パーツの読み込み
function loadContent(url, elementId) {
    if (document.getElementById(elementId) != null) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            });
    }
}
