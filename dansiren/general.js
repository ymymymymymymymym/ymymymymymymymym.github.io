main();

function main() {
    const elements = ["header", "totop", "home", "groups", "members", "pairs"];
    elements.forEach(element => {
        //loadContent(`https://ykmsms.github.io/dansiren/parts/${element}.html`, element);
        loadHTML(element);
    });
    window.onload = function() {
        elements.forEach(element => {
            loadJS(element);
        });
    };
}

//パーツの一括読み込み
function loadItem(parts) {
    if (document.getElementById(parts) != null) {
        loadHTML(parts);
        loadJS(parts);
    } else {
        return;
    }
}

//パーツの読み込み
function loadHTML(parts) {
    if (document.getElementById(parts) != null) {
        fetch(`https://ykmsms.github.io/dansiren/parts/${parts}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById(parts).innerHTML = data;
            });
    }
}

function loadJS(parts) {
    if (document.getElementById(parts) != null) {
        const body = document.querySelector("body");
        const partsJS = document.createElement("script");
        partsJS.src = `https://ykmsms.github.io/dansiren/parts/${parts}.js`;
        body.appendChild(partsJS);
    } else {
        return;
    }
}