window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    if(window.pageYOffset > 10){
        //header.style.opacity = '0.7';
        header.style.backgroundColor ='rgba(255,255,255,0.5)';
        header.style.backdropFilter = 'blur(10px)';
    }else if(window.pageYOffset < 200){
        //header.style.opacity = '1';
        header.style.backgroundColor ='rgba(255,255,255,1)';
        header.style.backdropFilter = NaN;
    }
});