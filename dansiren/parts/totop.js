//ToTopボタン
const scrollToTopBtn = document.querySelector('#scrollToTopBtn');
//クリックイベントを追加
scrollToTopBtn.addEventListener('click', scrollToTop);
function scrollToTop() {
    window.scroll({top: 0, behavior: 'smooth'});
};
//スクロール時のイベントを追加
window.addEventListener('scroll', scrollEvent);
function scrollEvent() {
    if(window.pageYOffset > 200) {
        scrollToTopBtn.style.opacity = '1';
    }else if(window.pageYOffset < 200) {
        scrollToTopBtn.style.opacity = '0';
    }
};
