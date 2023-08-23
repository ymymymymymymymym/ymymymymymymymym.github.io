document.addEventListener("DOMContentLoaded", function () {
    loadContent("https://ykmsms.github.io/dansiren/parts/header.html", "header");
    loadContent("https://ykmsms.github.io/dansiren/parts/totop.html", "totop");
});

//パーツの一括読み込み
function loadItem(parts) {
    loadContent(`https://ykmsms.github.io/dansiren/parts/${parts}.html`, parts);
    const head = document.querySelector(parts);
    const partsCSS = document.createElement("link");
    partsCSS.rel = "stylesheet";
    partsCSS.href = `https://ykmsms.github.io/dansiren/parts/${parts}.css`;
    head.appendChild(partsCSS);
    const body = document.querySelector("body");
    const partsJS = document.createElement("script");
    partsJS.src = `https://ykmsms.github.io/dansiren/parts/${parts}.js`;
    body.appendChild(partsJS);
}

//パーツの読み込み
function loadContent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });
}
