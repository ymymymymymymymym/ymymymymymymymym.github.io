window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    if(window.pageYOffset > 10){
        header.style.opacity = '0.7';
    }else if(window.pageYOffset < 200){
        header.style.opacity = '1';
    }
});
